# 1. Describe how you would architect/design the application?

**R/**  
La arquitectura más adecuada para el sistema en cuestión sería una **arquitectura de microservicios**, complementada con **eventos y colas de mensajes** para las tareas asíncronas, tales como el procesamiento del archivo que se envía a la red ACH.

## 1.1 What modules/components would you create?

**R/**  
Para esta solución se proponen los siguientes microservicios:

- **API Gateway**: un punto de entrada único que maneja todas las solicitudes. Se encargará del ruteo y autenticación.
- **Microservicio de Autenticación**: maneja la autenticación y autorización al resto de servicios.
- **Microservicio de Gestión de Usuarios**: gestiona el registro de usuarios y la gestión de perfiles.
- **Microservicio de Solicitud de Préstamos**: gestiona el proceso de solicitud de préstamos, incluida la captura de datos, la validación y las actualizaciones de estado.
- **Microservicio de Obtención de Datos Adicionales**: hace consultas para obtener datos de terceros a través de integraciones, para su posterior uso al procesar solicitudes de préstamo.
- **Microservicio de Procesamiento de Préstamos**: gestiona el flujo de trabajo de aprobación de préstamos, verificación de créditos, calificación del importe del préstamo.
- **Microservicio de Gestión de Préstamos**: gestiona los préstamos, los desembolsos de los mismos y mantiene datos como el saldo restante e historial de pagos.
- **Microservicio de Procesamiento de Pagos**: gestiona el cobro de los pagos y la conciliación.
- **Microservicio de Notificaciones**: envía notificaciones a los usuarios sobre el estado de la solicitud, del préstamo, recordatorios de pago, etc.
- **Microservicio de Tareas Programadas (cron jobs)**: ejecuta tareas programadas que sean requeridas por el sistema.

## 1.2 How would the information flow between components?

**R/**  
El flujo sería el siguiente:

1. **Registro del usuario**:  
   el proceso inicia cuando el usuario se registra diligenciando su correo electrónico y contraseña una vez hecho esto el frontend hace una solicitud al micro servicio de autenticación para crear una cuenta de usuario y obtener un JWT para                 transacciones seguras, luego si el usuario desea diligenciar sus datos y solicitud en otro momento, ya tendría que omitir este paso y diligenciar el resto de información cuando lo crea pertinente, solamente tendría que iniciar sesion y diligenciar      el resto de datos solicitados

2. **Solicitud de préstamo**:  
   una vez registrados todo los datos del usuario el servicio de gestión de usuarios almacena la información diligenciada y se comunica con el servicio de aplicación de préstamos para iniciar formalmente el proceso de solicitud

3. **Evaluación de préstamo**:  
   durante esta etapa se recopilan los datos necesarios del préstamo incluyendo información crediticia y datos provenientes de servicios externos como yelp, estos datos luego son procesados por el microservicio de evaluación el cual calcula el nivel de riesgo del solicitante y determina si se aprueba o rechaza el préstamo

4. **Decisión y aceptación del préstamo**:  
   La decisión se envía al usuario. Si acepta, el frontend informa al servicio de gestión de préstamos para iniciar la creación del préstamo y su desembolso.

5. **Gestión del préstamo y realización de pagos**:  
   Se procede a hacer la creacion del prestamo, y una vez creado el préstamo, el servicio de gestión informa al servicio de gestión de pagos la programación correspondiente de los pagos diarios

6. **Envío de información a la red ACH**:  
   El microservicio de tareas programadas genera un archivo diario que se envía a la red ACH para su procesamiento. Según los resultados, se actualiza el estado de los préstamos y se registran transacciones fallidas si las hay.

> En el siguiente diagrama de secuencia se explica un poco más el flujo:  
[![](https://mermaid.ink/img/pako:eNp9Vd1u2jAUfhXLUqVVgq5AKG0uKqUB9iO2oVI0beLGxIdgLYkz22Frqz7MLnexqz0CL7bjOEmjgsYNic93vu_8Oo80khyoTzV8LyCLYCxYrFi6ygj-cqaMiETOMkOWhGmy1AVTQh5ap9Y6VTIzkPFDc2DNQYFGPGKRkNkRgYUFLUDt8EQSDqRwavoQOysJdQvL8qRitm-5Am1YeiTQcekp1xhKDebMSE0Yt1QZS-CIXjixXjGSVj5aopwwBQf9f73Z4oVnDT2iMj_AsvgY7sbCboGTIHy7qip5coInsdBGVUEsu9fXU785JK8gZSLpIJHWP6Tipw42RVjgk1ABU3XBnSXoOob3n-_InfwGWUtqUafvMtr_bmVfCYcyzRMwrCpvDkq76pJ7dEpIBrGMai0bxXLhkzeoz18GYo0zjPFdhppobGrfCiiIFcTY_v3f55Y64yxA9zG6f7I9B1XFg6AI4-bCyA5ZsyzCvy-Q5M5pXCZvRceHw9GITnYsKZxoSyuc-JVFNRLOHE5q1lvQRWIYx7YEuZJrfHp9C9GWPeDTaUPmKvlBYgORjEMktBN7zjuC3LRDYAluW0WJla4KSViJc5BWk5y7etnCpuqLejKOAGYLRMwRMVfSXhkWZeeVcNHa2gZ5g9219UfYPYFsZzuJYwiuX6AhXctEt_hvunUEMtsIlba6ewSNGi6lj9KIDV4FqgUjmEMibG2dQ3lHNTUM5Rr3w0VNWGFkuv-Fu1Zh53WadfRMRVuxk3b5SIR7WiWNI833f1jLCTOeuDxbLs5e5mZJg8piibDJmWaRHTTckg1LEsGZbhHaYgSRKcpcFLH3CJelcqs9tENjJTj1jSqgQ1PAytlX-miZVtRsIYUV9fGRw4bhGK7oKntCN7xbvkqZ1p5KFvGW-hiHxrcix72pvw4NBAsJKpRFZqjvnQ9KDuo_0p_U7w68s2GvPxgOL889zxsMLjr0nvpXo7N-z-uN-oOLQf-y1x8-dehDqdo7643w7KLf93oDz7saPf0DWY4sCQ?type=png)](https://mermaid.live/edit#pako:eNp9Vd1u2jAUfhXLUqVVgq5AKG0uKqUB9iO2oVI0beLGxIdgLYkz22Frqz7MLnexqz0CL7bjOEmjgsYNic93vu_8Oo80khyoTzV8LyCLYCxYrFi6ygj-cqaMiETOMkOWhGmy1AVTQh5ap9Y6VTIzkPFDc2DNQYFGPGKRkNkRgYUFLUDt8EQSDqRwavoQOysJdQvL8qRitm-5Am1YeiTQcekp1xhKDebMSE0Yt1QZS-CIXjixXjGSVj5aopwwBQf9f73Z4oVnDT2iMj_AsvgY7sbCboGTIHy7qip5coInsdBGVUEsu9fXU785JK8gZSLpIJHWP6Tipw42RVjgk1ABU3XBnSXoOob3n-_InfwGWUtqUafvMtr_bmVfCYcyzRMwrCpvDkq76pJ7dEpIBrGMai0bxXLhkzeoz18GYo0zjPFdhppobGrfCiiIFcTY_v3f55Y64yxA9zG6f7I9B1XFg6AI4-bCyA5ZsyzCvy-Q5M5pXCZvRceHw9GITnYsKZxoSyuc-JVFNRLOHE5q1lvQRWIYx7YEuZJrfHp9C9GWPeDTaUPmKvlBYgORjEMktBN7zjuC3LRDYAluW0WJla4KSViJc5BWk5y7etnCpuqLejKOAGYLRMwRMVfSXhkWZeeVcNHa2gZ5g9219UfYPYFsZzuJYwiuX6AhXctEt_hvunUEMtsIlba6ewSNGi6lj9KIDV4FqgUjmEMibG2dQ3lHNTUM5Rr3w0VNWGFkuv-Fu1Zh53WadfRMRVuxk3b5SIR7WiWNI833f1jLCTOeuDxbLs5e5mZJg8piibDJmWaRHTTckg1LEsGZbhHaYgSRKcpcFLH3CJelcqs9tENjJTj1jSqgQ1PAytlX-miZVtRsIYUV9fGRw4bhGK7oKntCN7xbvkqZ1p5KFvGW-hiHxrcix72pvw4NBAsJKpRFZqjvnQ9KDuo_0p_U7w68s2GvPxgOL889zxsMLjr0nvpXo7N-z-uN-oOLQf-y1x8-dehDqdo7643w7KLf93oDz7saPf0DWY4sCQ)

---

# 2. How would you design the database and its tables?

**R/**  
Usaría una base de datos híbrida: una instancia en una **RDBMS** y otra base de datos **NoSQL** para guardar datos no estructurados, obtenidos de integraciones con terceros (consultas de reportes de crédito, transacciones bancarias, reseñas de Yelp, etc.), así como logs o transacciones con la red ACH.

> **Nota:** Las tablas no relacionadas corresponden a colecciones en la base de datos NoSQL.
> ![Untitled(2)](https://github.com/user-attachments/assets/9455697b-0f95-4044-9457-dd81cb1c9294)


---

# 3. Imagine you need to scale the platform to increase 100x the current users: Which scalability techniques would you use?

**R/**  
- **Arquitectura de microservicios**: ya mencionada, permite escalar servicios individuales según necesidad.
- **Escalado Horizontal**: añadir más instancias de los microservicios mediante balanceadores de carga.
- **Almacenamiento en caché**: para reducir el número de consultas a la base de datos.
- **Optimización de base de datos**: mejorar las consultas para reducir tiempos de respuesta.

# 4. Write a small application that simulates the application process. The information does not need to be stored in a database.
**R/** la aplicacion se encuentra desplegada en la siguiente url : http://54.90.81.157/

> **Nota:** Por cuestiones de tiempo no se realizo el despliegue en protocolo https por lo que se utilizo http en su lugar, el servicio se encuentra desplegados en AWS EC2

# 5.Send to the interviewer the amount of time you spent doing the test, if different with the estimated time of point 1 explain the reason
**R/** tiempo aproximado alrededor de 3 horas y media
