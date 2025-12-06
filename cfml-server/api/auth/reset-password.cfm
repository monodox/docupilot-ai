<cfheader name="Access-Control-Allow-Origin" value="*">
<cfheader name="Access-Control-Allow-Methods" value="POST, OPTIONS">
<cfheader name="Access-Control-Allow-Headers" value="Content-Type">
<cfheader name="Content-Type" value="application/json">

<cfif cgi.request_method EQ "OPTIONS">
  <cfabort>
</cfif>

<cftry>
  <cfset requestBody = toString(getHttpRequestData().content)>
  <cfset data = deserializeJSON(requestBody)>
  
  <!--- Validate token --->
  <cfquery name="qUser" datasource="yourDatasource">
    SELECT id FROM users
    WHERE reset_token = <cfqueryparam value="#data.token#" cfsqltype="cf_sql_varchar">
    AND reset_token_expires > <cfqueryparam value="#now()#" cfsqltype="cf_sql_timestamp">
  </cfquery>
  
  <cfif qUser.recordCount GT 0>
    <!--- Update password --->
    <cfquery datasource="yourDatasource">
      UPDATE users
      SET password = <cfqueryparam value="#hash(data.password, 'SHA-256')#" cfsqltype="cf_sql_varchar">,
          reset_token = NULL,
          reset_token_expires = NULL
      WHERE id = <cfqueryparam value="#qUser.id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <cfset response = {
      "success": true,
      "message": "Password reset successful"
    }>
  <cfelse>
    <cfset response = {
      "success": false,
      "message": "Invalid or expired token"
    }>
  </cfif>
  
  <cfcatch>
    <cfset response = {
      "success": false,
      "message": "Server error"
    }>
  </cfcatch>
</cftry>

<cfoutput>#serializeJSON(response)#</cfoutput>
