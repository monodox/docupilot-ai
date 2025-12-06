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
  <cfquery name="qCheck" datasource="yourDatasource">
    SELECT id FROM users
    WHERE email = <cfqueryparam value="#data.email#" cfsqltype="cf_sql_varchar">
  </cfquery>
  
  <cfif qCheck.recordCount GT 0>
    <cfset response = {
      "success": false,
      "message": "Email already exists"
    }>
  <cfelse>
    <!--- Insert new user --->
    <cfquery datasource="yourDatasource">
      INSERT INTO users (name, email, password, created_at)
      VALUES (
        <cfqueryparam value="#data.name#" cfsqltype="cf_sql_varchar">,
        <cfqueryparam value="#data.email#" cfsqltype="cf_sql_varchar">,
        <cfqueryparam value="#hash(data.password, 'SHA-256')#" cfsqltype="cf_sql_varchar">,
        <cfqueryparam value="#now()#" cfsqltype="cf_sql_timestamp">
      )
    </cfquery>
    
    <cfset response = {
      "success": true,
      "message": "Account created successfully"
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
