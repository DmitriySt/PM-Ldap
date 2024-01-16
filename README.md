# Менеджер паролей с LDAP авторизацией 

Менеджер паролей с доменной авторизацией.

demo: [pm-demo.host15.ru](https://pm-demo.host15.ru/)

## Установка
Вам понадобится:
1. NodeJs 10+
2. Postgresql 10+
3. LDAP сервер для авторизации (Active Directory или OpenLDAP)

Будет рассмотрен способ запуска "монолитного" приложения.

1. Клонирование репозитория
```git clone https://github.com/DmitriySt/PM-Ldap.git```
2. Переходим в директорию с PM-Ldap
```cd PM-Ldap```
3. Устанавливаем зависимости:  
   **npm** : `npm install`  
   **yarn** : `yarn install`  
4. Редактируем файл настроек ```./backend/.env```  
   **APP_PORT**= Порт на котором будет запущено приложение  
   **POSTGRES_HOST** = Сервер БД  
   **POSTGRES_PORT** = Порт сервера БД  
   **POSTGRES_DB** = Имя БД  
   **POSTGRES_USER** = Пользователь БД  
   **POSTGRES_PASSWORD** = Пароль пользователя БД  
   **AUTH_TYPE** = LDAP (Не изменять)  
   **LDAP_DOMAIN** = Наименование домена (example.com)  
   **LDAP_DN** = Контейнер с пользователями в домене (dc=example,dc=com)  
   **LDAP_HOST** = ip адрес или имя контроллера домена (dc1.example.com)  
   **LDAP_PORT** = Порт подключения к LDAP (389)  
   **LDAP_GROUP** = Не обязательный параметр. Если указан, то доступ к приложению будут иметь только пользователи состоящие в определенной группе (CN=app_group,OU=Users,dc=example,dc=com)  
   **LDAP_SSL** = (true | false)  
   **JWT_ACCESS_SECRET** = Рандомная строка 32+ символов  
   **JWT_REFRESH_SECRET** = Рандомная строка 32+ символов  
   **JWT_ACCESS_EXPIRES** = Время жизни ACCESS токена (10m)  
   **COOKIE_SECRET** =  Рандомная строка 32+ символов  
   **PASS_SECRET** =  Рандомная строка 32+ символов  
   **PASS_SALT** =  Рандомная строка 32+ символов  
   **SSL** = Использовать или нет SSL (true | false)
   **SSL_KEY** = ./ssl/localhost.key  
   **SSL_CERT** = ./ssl/localhost.crt  

   >[!NOTE]
   >При включении SSL вам необходимо поместить сертификат и закрытый ключ в папку /backend/ssl до сборки приложения  
   > Если сертификата нет, вы можете использовать самоподписаный сертификат. Сгенерировать его можно используя файл create_ssl.sh <имя хоста> например: `create_ssl.sh example.com`
   
5. Переходим в корень ```cd ..```
6. Запускаем файл  
   **windows** : `build_standalone.bat`  
   **Linux** : `build_standalone.sh`
7.  Переходим в директорию backend ```cd ./backend```
8.  Запускаем приложение:  
    **npm** : `npm run start`  
    **yarn** : `yarn start` 
