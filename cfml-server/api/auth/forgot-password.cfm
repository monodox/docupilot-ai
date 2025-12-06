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
  
  <!--- Check if user exists --->
  <cfquery name="qUser" datasource="yourDatasource">
    SELECT id, email FROM users
    WHERE email = <cfqueryparam value="#data.email#" cfsqltype="cf_sql_varchar">
  </cfquery>
  
  <cfif qUser.recordCount GT 0>
    <!--- Generate reset token --->
    <cfset resetToken = createUUID()>
    
    <!--- Store token in database --->
    <cfquery datasource="yourDatasource">
      UPDATE users
      SET reset_token = <cfqueryparam value="#resetToken#" cfsqltype="cf_sql_varchar">,
          reset_token_expires = <cfqueryparam value="#dateAdd('h', 1, now())#" cfsqltype="cf_sql_timestamp">
      WHERE id = <cfqueryparam value="#qUser.id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <!--- TODO: Send email with reset link --->
    
    <cfset response = {
      "success": true,
      "message": "Reset link sent to email"
    }>
  <cfelse>
    <cfset response = {
      "success": false,
      "message": "Email not found"
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
