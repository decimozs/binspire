<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" indent="yes" />

  <xsl:template match="/">
    <html>
      <head>
        <title>General Settings</title>
      </head>
      <body>
        <h1>General Settings</h1>
        <ul>
          <xsl:for-each select="settings/section">
            <li>
              <h2>
                <xsl:value-of select="title" />
              </h2>
              <p>
                <xsl:value-of select="description" />
              </p>
              <button>
                <xsl:value-of select="action" />
              </button>
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
