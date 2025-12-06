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
  
  <cfif NOT structKeyExists(data, "email") OR len(trim(data.email)) EQ 0>
    <cfset response = {
      "success": false,
      "message": "Email is required"
    }>
  <cfelse>
    <cfquery name="qUpdate" datasource="docupilot_db">
      UPDATE users
      SET 
        first_name = <cfqueryparam value="#trim(data.firstName)#" cfsqltype="cf_sql_varchar">,
        last_name = <cfqueryparam value="#trim(data.lastName)#" cfsqltype="cf_sql_varchar">
      WHERE email = <cfqueryparam value="#trim(data.email)#" cfsqltype="cf_sql_varchar">
    </cfquery>
    
    <cfquery name="qUser" datasource="docupilot_db">
      SELECT id, first_name, last_name, email
      FROM users
      WHERE email = <cfqueryparam value="#trim(data.email)#" cfsqltype="cf_sql_varchar">
    </cfquery>
    
    <cfif qUser.recordCount GT 0>
      <cfset response = {
        "success": true,
        "message": "Profile updated successfully",
        "user": {
          "id": qUser.id,
          "firstName": qUser.first_name,
          "lastName": qUser.last_name,
          "email": qUser.email
        }
      }>
    <cfelse>
      <cfset response = {
        "success": false,
        "message": "User not found"
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
