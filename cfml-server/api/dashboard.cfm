<cfheader name="Access-Control-Allow-Origin" value="*">
<cfheader name="Access-Control-Allow-Methods" value="GET, OPTIONS">
<cfheader name="Access-Control-Allow-Headers" value="Content-Type">
<cfheader name="Content-Type" value="application/json">

<cfif cgi.request_method EQ "OPTIONS">
  <cfabort>
</cfif>

<cftry>
  <cfquery name="qDocCount" datasource="docupilot_db">
    SELECT COUNT(*) as total FROM documents
  </cfquery>
  
  <cfquery name="qTemplateCount" datasource="docupilot_db">
    SELECT COUNT(*) as total FROM templates
  </cfquery>
  
  <cfquery name="qUserCount" datasource="docupilot_db">
    SELECT COUNT(*) as total FROM users
  </cfquery>
  
  <cfset response = {
    "success": true,
    "stats": {
      "documents": qDocCount.total,
      "templates": qTemplateCount.total,
      "users": qUserCount.total
    }
  }>
  
  <cfcatch>
    <cfset response = {
      "success": false,
      "message": "Server error: " & cfcatch.message
    }>
  </cfcatch>
</cftry>

<cfoutput>#serializeJSON(response)#</cfoutput>
