# beerWarsAdmin

Aplicación destinada a los administradores de una cerveceria con el fin de realizar competencias entre las mesas de la misma.
La app esta desarrollada en Ionic en conjunto con una API GraphQL creada utilizando Apollo.

Las pantallas de la aplicacion se encuentran en src/pages (no todas fueron utilizadas en la version final de la aplicación).

Dentro de src/services están los servicios para mesas y para gestionar los codigos QR.

En app/graphql.ts podemos ver todas las consultas GraphQL utilizadas por la aplicación.
Las que llevan nombre QUERY solo obtienen datos.
Por otro lado, las que llevan nombre MUTATION generan cambios en la base de datos.
Por último, las SUBSCRIPTION se utilizan para obtener una notificación del servidor cuando hay un cambio en la base.
