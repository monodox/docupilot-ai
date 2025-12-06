<cfheader name="Access-Control-Allow-Origin" value="*">
<cfheader name="Access-Control-Allow-Methods" value="GET, POST, DELETE, OPTIONS">
<cfheader name="Access-Control-Allow-Headers" value="Content-Type">
<cfheader name="Content-Type" value="application/json">

<cfif cgi.request_method EQ "OPTIONS">
  <cfabort>
</cfif>

<cftry>
  <cfif cgi.request_method EQ "GET">
    <cfquery name="qDocuments" datasource="decree_db">
      SELECT id, user_id, title, content, category, status, created_at, updated_at
      FROM documents
      ORDER BY created_at DESC
    </cfquery>
    
    <cfset documents = []>
    <cfloop query="qDocuments">
      <cfset arrayAppend(documents, {
        "id": qDocuments.id,
        "user_id": qDocuments.user_id,
        "title": qDocuments.title,
        "content": qDocuments.content,
        "category": qDocuments.category,
        "status": qDocuments.status,
        "created_at": qDocuments.created_at,
        "updated_at": qDocuments.updated_at
      })>
    </cfloop>
    
    <cfset response = {
      "success": true,
      "documents": documents
    }>
  <cfelseif cgi.request_method EQ "DELETE">
    <cfset id = url.id>
    
    <cfquery name="qDelete" datasource="decree_db">
      DELETE FROM documents
      WHERE id = <cfqueryparam value="#id#" cfsqltype="cf_sql_integer">
    </cfquery>
    
    <cfset response = {
      "success": true,
      "message": "Document deleted successfully"
    }>
  <cfelseif cgi.request_method EQ "POST">
    <cfset httpData = getHttpRequestData()>
    <cfset requestBody = toString(httpData.content)>
    <cfset data = deserializeJSON(requestBody)>
    
    <cfquery name="qInsert" datasource="decree_db">
      INSERT INTO documents (user_id, title, content, category, status)
      VALUES (
        <cfqueryparam value="#data.userId#" cfsqltype="cf_sql_integer">,
        <cfqueryparam value="#data.title#" cfsqltype="cf_sql_varchar">,
        <cfqueryparam value="#data.content#" cfsqltype="cf_sql_longvarchar">,
        <cfqueryparam value="#data.category#" cfsqltype="cf_sql_varchar">,
        'draft'
      )
    </cfquery>
    
    <cfset response = {
      "success": true,
      "message": "Document created successfully"
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
