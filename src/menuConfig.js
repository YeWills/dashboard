import Menus from '@routes/menu';

let menuConfig = [];
let asideMenuConfig = [];
menuConfig = [Menus];

asideMenuConfig = menuConfig.reduce((acc, cur) => {
  return acc.concat(cur);
});

export { asideMenuConfig };
