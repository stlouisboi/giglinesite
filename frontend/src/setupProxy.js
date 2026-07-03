/**
 * CRA dev-server middleware.
 * Mirrors the Vercel rewrite in /app/frontend/vercel.json so the clean URL
 *   GET /sample-corrective-action-log
 * resolves to the static PDF in dev preview as well as in production.
 */
module.exports = function (app) {
  app.get('/sample-corrective-action-log', (req, res) => {
    // 302 to the actual static file — browser downloads/opens inline.
    res.redirect(302, '/assets/GigLine_Sample_Corrective_Action_Log.pdf');
  });
};
