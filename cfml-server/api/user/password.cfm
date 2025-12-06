<cfheader name="Access-Control-Allow-Origin" value="*">
<cfheader name="Access-Control-Allow-Methods" value="PUT, OPTIONS">
<cfheader name="Access-Control-Allow-Headers" value="Content-Type">
<cfheader name="Content-Type" value="application/json">

<cfif cgi.request_method EQ "OPTIONS">
  <cfabort>
</cfif>

<cftry>
  <cfset httpData = getHttpRequestData()>
  <cfset requestBody = toString(httpData.content)>
  
  <cfif len(trim(requestBody)) GT 0>
    <cfset data = deserializeJSON(requestBody)>
  <cfelse>
    <cfset data = {}>
  </cfif>
  
  <cfif NOT structKeyExists(data, "email") OR NOT structKeyExists(data, "currentPassword") OR NOT structKeyExists(data, "newPassword")>
    <cfset response = {
      "success": false,
      "message": "All fields are required"
    }>
  <cfelse>
    <!--- Verify current password --->\n    <cfquery name="qVerify" datasource="docupilot_db">
      SELECT id
      FROM users
      WHERE email = <cfqueryparam value="#trim(data.email)#" cfsqltype="cf_sql_varchar">
      AND password = <cfqueryparam value="#trim(data.currentPassword)#" cfsqltype="cf_sql_varchar">
    </cfquery>
    
    <cfif qVerify.recordCount EQ 0>
      <cfset response = {
        "success": false,
        "message": "Current password is incorrect"
      }>
    <cfelse>
      <!--- Update password --->\n      <cfquery name="qUpdate" datasource="docupilot_db">
        UPDATE users
        SET password = <cfqueryparam value="#trim(data.newPassword)#" cfsqltype="cf_sql_varchar">
        WHERE email = <cfqueryparam value="#trim(data.email)#" cfsqltype="cf_sql_varchar">
      </cfquery>
      
      <cfset response = {
        "success": true,
        "message": "Password changed successfully"
      }>
    </cfif>
  </cfif>
  
  <cfcatch>
    <cfset response = {
      "success": false,
      "message": "Server error: " & cfcatch.message
    }>
  </cfcatch>
</cftry>

<cfoutput>#serializeJSON(response)#</cfoutput>
