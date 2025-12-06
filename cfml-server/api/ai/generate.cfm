<cfheader name="Access-Control-Allow-Origin" value="*">
<cfheader name="Access-Control-Allow-Methods" value="POST, OPTIONS">
<cfheader name="Access-Control-Allow-Headers" value="Content-Type">
<cfheader name="Content-Type" value="application/json">

<cfif cgi.request_method EQ "OPTIONS">
  <cfabort>
</cfif>

<cftry>
  <cfset httpData = getHttpRequestData()>
  <cfset requestBody = toString(httpData.content)>
  <cfset data = deserializeJSON(requestBody)>
  
  <cfif NOT structKeyExists(data, "prompt") OR len(trim(data.prompt)) EQ 0>
    <cfset response = {
      "success": false,
      "message": "Prompt is required"
    }>
  <cfelse>
    <!--- Step 1: Generate content with Gemma3 (Creator) --->
    <cfset creatorPrompt = "You are a professional legal document writer. Create a " & data.category & " document based on this request: " & data.prompt & ". Make it professional, clear, and legally sound.">
    
    <cfhttp url="http://localhost:11434/api/generate" method="POST" result="creatorResult" timeout="60">
      <cfhttpparam type="header" name="Content-Type" value="application/json">
      <cfhttpparam type="body" value='{"model": "gemma2", "prompt": "#creatorPrompt#", "stream": false}'>
    </cfhttp>
    
    <cfif creatorResult.statusCode EQ "200 OK">
      <cfset creatorResponse = deserializeJSON(creatorResult.fileContent)>
      <cfset generatedContent = creatorResponse.response>
      
      <!--- Step 2: Review and moderate with Gemma3 (Moderator) --->
      <cfset moderatorPrompt = "Review this " & data.category & " document for accuracy, completeness, and legal compliance. Suggest improvements if needed:\n\n" & generatedContent>
      
      <cfhttp url="http://localhost:11434/api/generate" method="POST" result="moderatorResult" timeout="60">
        <cfhttpparam type="header" name="Content-Type" value="application/json">
        <cfhttpparam type="body" value='{"model": "gemma2", "prompt": "#moderatorPrompt#", "stream": false}'>
      </cfhttp>
      
      <cfif moderatorResult.statusCode EQ "200 OK">
        <cfset moderatorResponse = deserializeJSON(moderatorResult.fileContent)>
        <cfset review = moderatorResponse.response>
        
        <!--- Step 3: Generate embeddings for semantic search --->
        <cfhttp url="http://localhost:11434/api/embeddings" method="POST" result="embeddingResult" timeout="30">
          <cfhttpparam type="header" name="Content-Type" value="application/json">
          <cfhttpparam type="body" value='{"model": "gemma2", "prompt": "#generatedContent#"}'>
        </cfhttp>
        
        <cfset embeddings = []>
        <cfif embeddingResult.statusCode EQ "200 OK">
          <cfset embeddingResponse = deserializeJSON(embeddingResult.fileContent)>
          <cfset embeddings = embeddingResponse.embedding>
        </cfif>
        
        <cfset response = {
          "success": true,
          "content": generatedContent,
          "review": review,
          "embeddings": embeddings,
          "metadata": {
            "creator_model": "gemma2",
            "moderator_model": "gemma2",
            "embedding_model": "gemma2",
            "generated_at": now()
          }
        }>
      <cfelse>
        <cfset response = {
          "success": false,
          "message": "Moderator model failed"
        }>
      </cfif>
    <cfelse>
      <cfset response = {
        "success": false,
        "message": "Creator model failed"
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
