<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" indent="yes" />

  <xsl:template match="/">
    <html>
      <head>
        <title>Admin Dashboard Data</title>
      </head>
      <body>
        <h1>Admin Teams</h1>
        <ul>
          <xsl:for-each select="data/adminData/teams/team">
            <li>
              <b>
                <xsl:value-of select="name" />
              </b> - Icon: <xsl:value-of select="icon" />
              - Online: <xsl:value-of select="onlines" />
            </li>
          </xsl:for-each>
        </ul>

        <h2>Navigation</h2>
        <xsl:for-each select="data/adminData/navMain/nav">
          <h3>
            <xsl:value-of select="title" />
          </h3>
          <ul>
            <xsl:for-each select="items/item">
              <li>
                <xsl:value-of select="title" /> - <xsl:value-of select="url" />
              </li>
            </xsl:for-each>
          </ul>
        </xsl:for-each>

        <h2>Projects</h2>
        <ul>
          <xsl:for-each select="data/adminData/projects/project">
            <li>
              <xsl:value-of select="name" /> - <xsl:value-of select="icon" />
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
