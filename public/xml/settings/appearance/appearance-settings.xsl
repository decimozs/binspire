<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <html>
      <head>
        <title>Appearance Settings</title>
        <style>
          body { font-family: sans-serif; }
          .setting { border: 1px dashed #ccc; padding: 1em; margin-bottom: 1em; }
          .title { font-weight: bold; }
          .action-button { background: #eee; padding: 0.5em 1em; border: none; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>Appearance</h1>
        <xsl:for-each select="AppearanceSettings/Setting">
          <div class="setting">
            <div class="title">
              <xsl:value-of select="Title" />
            </div>
            <div class="description">
              <xsl:value-of select="Description" />
            </div>
            <xsl:choose>
              <xsl:when test="Title='Font Size'">
                <div>
                  <button class="action-button">-</button>
                  <span><xsl:value-of select="FontSize" />px</span>
                  <button class="action-button">+</button>
                </div>
              </xsl:when>
              <xsl:when test="Title='High Contrast Mode'">
                <label>
                  <input type="checkbox">
                    <xsl:if test="Enabled='true'">
                      <xsl:attribute name="checked">checked</xsl:attribute>
                    </xsl:if>
                  </input>
                  Enable </label>
              </xsl:when>
              <xsl:otherwise>
                <button class="action-button">
                  <xsl:value-of select="Action" />
                </button>
              </xsl:otherwise>
            </xsl:choose>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
