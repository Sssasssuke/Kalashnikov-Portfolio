// Keep the existing case pages and their data unchanged.
window.PORTFOLIO_DATA.cases = Object.fromEntries(
  Object.entries(window.PORTFOLIO_DATA.cases).flatMap(([key, value]) => {
    const entries = [[key, value]];
    if (key === "fashion-fund") entries.push(["seo-geo", {
      page: "/seo-geo",
      shortTitle: "SEO/GEO-платформа",
      kicker: "UX/UI-дизайн · B2B SaaS · NDA",
      summary: "Превратил технический отчёт в полноценный сервис для маркетологов. Самостоятельно разобрался в логике продукта, спроектировал пользовательский путь, интерфейс и UI Kit.",
      preview: "/seo-geo/assets/seo-geo-cover.webp"
    }]);
    return entries;
  })
);
