export const ldapConfig = () => ({
  ldap: {
    host: process.env.LDAP_HOST,
    port: process.env.LDAP_PORT,
    dn: process.env.LDAP_DN,
    domain: process.env.LDAP_DOMAIN,
    group: process.env.LDAP_GROUP,
    ssl: process.env.LDAP_SSL,
  },
});
