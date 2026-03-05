# Conectar GitHub Pages con dominio de Namecheap

## 1. En GitHub (tu repositorio)

1. Ve a **Settings** → **Pages**
2. En "Custom domain", escribe tu dominio (ej: `tudominio.com`)
3. GitHub creará automáticamente un archivo `CNAME` en tu repo

## 2. En Namecheap (configuración DNS)

### Para dominio raíz (`tudominio.com`)

Añade registros **A** apuntando a las IPs de GitHub:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Para subdominio `www`

Añade un registro **CNAME** apuntando a `tuusuario.github.io`

## Pasos en Namecheap

1. Inicia sesión → Domain List → Manage
2. Ve a "Advanced DNS"
3. Añade los registros A y CNAME mencionados
4. Elimina cualquier registro conflictivo existente

## Notas importantes

- La propagación DNS puede tardar hasta 24-48 horas
- Después puedes activar "Enforce HTTPS" en GitHub Pages para SSL gratuito
- Si tu dominio es `juanfranj.com` (o similar), el CNAME debe apuntar a `juanfranj.github.io`
