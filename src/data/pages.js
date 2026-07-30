import homeData from './pages/home.json';

export const pageData = {
  home: homeData
};

export function getPageData(page) {
  return pageData[page] || pageData.home;
}