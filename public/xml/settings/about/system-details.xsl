<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:template match="/">
    <html>
      <head>
        <title>System Details - Binspire</title>
        <style>
          body { font-family: Arial; max-width: 800px; margin: auto; line-height: 1.6; }
          h1 { font-size: 24px; margin-bottom: 1em; }
          .row { display: flex; justify-content: space-between; margin-bottom: 0.5em; }
          .label { color: #666; }
          .value { font-weight: bold; }
          .section { margin-top: 2em; border-top: 1px solid #ccc; padding-top: 1em; }
        </style>
      </head>
      <body>
        <h1>System Details</h1>

        <div class="row">
          <span class="label">Name</span>
          <span class="value">
            <xsl:value-of select="systemDetails/name" />
          </span>
        </div>
        <div class="row">
          <span class="label">Community</span>
          <span class="value">
            <xsl:value-of select="systemDetails/community" />
          </span>
        </div>
        <div class="row">
          <span class="label">Status</span>
          <span class="value">
            <xsl:value-of select="systemDetails/status" />
          </span>
        </div>
        <div class="row">
          <span class="label">Version</span>
          <span class="value">
            <xsl:value-of select="systemDetails/version" />
          </span>
        </div>
        <div class="row">
          <span class="label">Environment</span>
          <span class="value">
            <xsl:value-of select="systemDetails/environment" />
          </span>
        </div>
        <div class="row">
          <span class="label">Uptime</span>
          <span class="value">
            <xsl:value-of select="systemDetails/uptime" />
          </span>
        </div>
        <div class="row">
          <span class="label">Last Updated</span>
          <span class="value">
            <xsl:value-of select="systemDetails/lastUpdated" />
          </span>
        </div>
        <div class="row">
          <span class="label">Server Region</span>
          <span class="value">
            <xsl:value-of select="systemDetails/serverRegion" />
          </span>
        </div>
        <div class="row">
          <span class="label">Developed By</span>
          <span class="value">
            <xsl:value-of select="systemDetails/developedBy" />
          </span>
        </div>
        <div class="row">
          <span class="label">Contact</span>
          <span class="value">
            <xsl:value-of select="systemDetails/contact" />
          </span>
        </div>

        <div class="section">
          <h2>About Binspire</h2>
          <p>
            <xsl:value-of select="systemDetails/about" />
          </p>
        </div>

        <div class="section">
          <h3>Links</h3>
          <ul>
            <xsl:for-each select="systemDetails/links/link">
              <li>
                <xsl:value-of select="@type" />: <a href="{.}">
                  <xsl:value-of select="." />
                </a>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
