<cfheader name="Access-Control-Allow-Origin" value="*">
<cfheader name="Access-Control-Allow-Methods" value="GET, DELETE, OPTIONS">
<cfheader name="Access-Control-Allow-Headers" value="Content-Type">
<cfheader name="Content-Type" value="application/json">

<cfif cgi.request_method EQ "OPTIONS">
  <cfabort>
</cfif>

<cftry>
  <cfif cgi.request_method EQ "DELETE">
    <cfset id = url.id>
    
    <cfquery name="qDelete" datasource="decree_db">
      DELETE FROM templates
      WHERE id = <cfqueryparam value="#id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <cfset response = {
      "success": true,
      "message": "Template deleted successfully"
    }>
  <cfelse>
    <cfquery name="qTemplates" datasource="decree_db">
    SELECT id, name, description, content, category, is_public, created_at
    FROM templates
    WHERE is_public = 1
    ORDER BY created_at DESC
  </cfquery>
  
  <cfset templates = []>
  <cfloop query="qTemplates">
    <cfset arrayAppend(templates, {
      "id": qTemplates.id,
      "name": qTemplates.name,
      "description": qTemplates.description,
      "content": qTemplates.content,
      "category": qTemplates.category,
      "created_at": qTemplates.created_at
    })>
  </cfloop>
  
    <cfset response = {
      "success": true,
      "templates": templates
    }>
  </cfif>
  
  <cfcatch>
    <cfset response = {
      "success": false,
      "message": "Server error: " & cfcatch.message
    }>
  </cfcatch>
</cftry>

<cfoutput>#serializeJSON(response)#</cfoutput>
