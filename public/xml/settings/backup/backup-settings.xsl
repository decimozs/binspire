<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/backupSettings">
    <html>
      <head>
        <title>Backup Settings Summary</title>
      </head>
      <body>
        <h1>Backup Summary</h1>
        <h2>Backup Details</h2>
        <ul>
          <li>
            <strong>File:</strong>
            <xsl:value-of select="backup/filename" />
          </li>
          <li>
            <strong>Created:</strong>
            <xsl:value-of select="backup/createdAt" />
          </li>
          <li>
            <strong>Size:</strong>
            <xsl:value-of select="backup/size" />
            <xsl:value-of select="backup/size/@unit" />
          </li>
          <li>
            <strong>Description:</strong>
            <xsl:value-of select="backup/description" />
          </li>
        </ul>

        <h2>Restore Details</h2>
        <ul>
          <li>
            <strong>Last Restored:</strong>
            <xsl:value-of select="restore/lastRestored" />
          </li>
          <li>
            <strong>Restored By:</strong>
            <xsl:value-of select="restore/restoredBy" />
          </li>
          <li>
            <strong>Note:</strong>
            <xsl:value-of select="restore/note" />
          </li>
        </ul>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
