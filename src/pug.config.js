// pug.config.js

module.exports = {
    locals: {
      hello: "world",
      pageList: [
        {
          url: '/505',
          name: '505 страница'
        },
        {
          url: '/404',
          name: '404 страница'
        },
        {
          url: '/login',
          name: 'Логин'
        },
        {
          url: '/signin',
          name: 'Регистрация'
        },
        {
          url: '/chats',
          name: 'Чат'
        },
        {
          url: '/profile-main',
          name: 'Профиль'
        },
        {
          url: '/profile-main-edit',
          name: 'Профиль - Изменить данные'
        },
        {
          url: '/profile-main-password',
          name: 'Профиль - Изменить пароль'
        },
      ]
    }
  };