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
- **Microservicio de Procesamiento de Préstamos**: gestiona el flujo de trabajo de aprobación de préstamos, verificación de créditos, calificación del importe del préstamo y preparación de documentos.
- **Microservicio de Gestión de Préstamos**: gestiona los préstamos y mantiene datos como el saldo restante e historial de pagos.
- **Microservicio de Procesamiento de Pagos**: gestiona el desembolso de los préstamos, el cobro de los pagos y la conciliación.
- **Microservicio de Notificaciones**: envía notificaciones a los usuarios sobre el estado de la solicitud, del préstamo, recordatorios de pago, etc.
- **Microservicio de Tareas Programadas (cron jobs)**: ejecuta tareas programadas que sean requeridas por el sistema.

## 1.2 How would the information flow between components?

**R/**  
El flujo sería el siguiente:

1. **Registro del usuario**:  
   El proceso inicia cuando el usuario se registra diligenciando su correo electrónico y contraseña. El frontend hace una solicitud al microservicio de autenticación para crear una cuenta de usuario y obtener un JWT para transacciones seguras.

2. **Solicitud de préstamo**:  
   Una vez registrados todos los datos del usuario, el servicio de gestión de usuarios almacena la información diligenciada y se comunica con el servicio de solicitud de préstamos para iniciar formalmente el proceso.

3. **Evaluación de préstamo**:  
   Se recopilan datos necesarios del préstamo, incluyendo información crediticia y datos de servicios externos como Yelp. Estos son procesados por el microservicio de evaluación, que calcula el riesgo del solicitante y determina si se aprueba o rechaza.

4. **Decisión y aceptación del préstamo**:  
   La decisión se envía al usuario. Si acepta, el frontend informa al servicio de gestión de préstamos para iniciar la creación del préstamo y su desembolso.

5. **Gestión del préstamo y realización de pagos**:  
   El servicio de gestión informa al de pagos sobre la programación correspondiente de pagos diarios.

6. **Envío de información a la red ACH**:  
   El microservicio de tareas programadas genera un archivo diario que se envía a la red ACH para su procesamiento. Según los resultados, se actualiza el estado de los préstamos y se registran transacciones fallidas si las hay.

> En el siguiente diagrama de secuencia se explica un poco más el flujo:  
[![](https://mermaid.ink/img/pako:eNp9Vctu2zAQ_BWCQIAGcFInfusQQJGdtIaLGlGMooUvtMjIRCVSJSm3SZCP6bGHnvoJ_rEuRUkRbCG-WOLOzgx3l9QzjiRl2MOa_ciZiNiUk1iRdC0Q_DKiDI94RoRBK0Q0WumcKC6Pozc2eqOkMEzQ47Bvw34OQVgiEZeiRSC0oJCpHaxIRBnKnZo-xi4KQt3Akiwpme1bppg2JG0xOi0y5QasVGBKjNSIUEslSMJa9IKZzYqBtMzREuS4ySnTb-stwoPMCtqisjzCkrgNF8wPKxVA5edy04K9ttA7RpEffFiXVT85gZWYa6NKw6uzq6sbr15E71hKeNIBIq1_SkVPHewGYL4HYoyoqjku4p85hvmXe3QvvzPRkAqrUrnd7_80KlUKBzLNEmZI2YqMKe06gR4hKUGCxTKqtKyLVeihW9Cnh0ZscAEePwrQhGDdp4YhP1YshlHZ_3ttvwsufEifQvpnOx9MlX4AFIFvyo3soA0REfx9ZUnmkqbF5q3o9HiQatHZjiS5E21oBTOvjKhawoWDWcV6x3SeGEKhLX6m5Aae3t-xaEue4Om0JnOV_CShgUBGWcS1E3vdd8Qy07RAEjiZJSVUuiwkIgXOQRpNcunqsIV11cNqMloAixAQS0AslbTXi0XZ2UaUN054cXXUdgO5gVF0AERyI9P9bxjrqj7zkrFqlePLSn5atC1BdP-33MkytCUK5uDhWLlgs7FbywXuiIq2fCfdqakR19AtseNt8euK3S8jERxhaIXQJLLjALP8QJKEU6IPNvBRPEhlK_IWehmWJfYjk5OEPwHe3iNUFttslBx3cKw4xZ5ROevglAG3fcXPlmmNzZalbI09eKTsgcBorfFavEAa3BffpEyrTCXzeIs98KHhLc_gLFRfh3pVQcuYCmQuDPb642FBgr1n_At7Z_3B6Lw3GI3G4-54MOmNBh38iL0xLF70h-PLbnc47g0m_ZcOfipkL84Hl6N-rzecdEeXg35vMnz5DwxVLdQ?type=png)](https://mermaid.live/edit#pako:eNp9Vctu2zAQ_BWCQIAGcFInfusQQJGdtIaLGlGMooUvtMjIRCVSJSm3SZCP6bGHnvoJ_rEuRUkRbCG-WOLOzgx3l9QzjiRl2MOa_ciZiNiUk1iRdC0Q_DKiDI94RoRBK0Q0WumcKC6Pozc2eqOkMEzQ47Bvw34OQVgiEZeiRSC0oJCpHaxIRBnKnZo-xi4KQt3Akiwpme1bppg2JG0xOi0y5QasVGBKjNSIUEslSMJa9IKZzYqBtMzREuS4ySnTb-stwoPMCtqisjzCkrgNF8wPKxVA5edy04K9ttA7RpEffFiXVT85gZWYa6NKw6uzq6sbr15E71hKeNIBIq1_SkVPHewGYL4HYoyoqjku4p85hvmXe3QvvzPRkAqrUrnd7_80KlUKBzLNEmZI2YqMKe06gR4hKUGCxTKqtKyLVeihW9Cnh0ZscAEePwrQhGDdp4YhP1YshlHZ_3ttvwsufEifQvpnOx9MlX4AFIFvyo3soA0REfx9ZUnmkqbF5q3o9HiQatHZjiS5E21oBTOvjKhawoWDWcV6x3SeGEKhLX6m5Aae3t-xaEue4Om0JnOV_CShgUBGWcS1E3vdd8Qy07RAEjiZJSVUuiwkIgXOQRpNcunqsIV11cNqMloAixAQS0AslbTXi0XZ2UaUN054cXXUdgO5gVF0AERyI9P9bxjrqj7zkrFqlePLSn5atC1BdP-33MkytCUK5uDhWLlgs7FbywXuiIq2fCfdqakR19AtseNt8euK3S8jERxhaIXQJLLjALP8QJKEU6IPNvBRPEhlK_IWehmWJfYjk5OEPwHe3iNUFttslBx3cKw4xZ5ROevglAG3fcXPlmmNzZalbI09eKTsgcBorfFavEAa3BffpEyrTCXzeIs98KHhLc_gLFRfh3pVQcuYCmQuDPb642FBgr1n_At7Z_3B6Lw3GI3G4-54MOmNBh38iL0xLF70h-PLbnc47g0m_ZcOfipkL84Hl6N-rzecdEeXg35vMnz5DwxVLdQ)

---

# 2. How would you design the database and its tables?

**R/**  
Usaría una base de datos híbrida: una instancia en una **RDBMS** y otra base de datos **NoSQL** para guardar datos no estructurados, obtenidos de integraciones con terceros (consultas de reportes de crédito, transacciones bancarias, reseñas de Yelp, etc.), así como logs o transacciones con la red ACH.

> **Nota:** Las tablas no relacionadas corresponden a colecciones en la base de datos NoSQL.

---

# 3. Imagine you need to scale the platform to increase 100x the current users: Which scalability techniques would you use?

**R/**  
- **Arquitectura de microservicios**: ya mencionada, permite escalar servicios individuales según necesidad.
- **Escalado Horizontal**: añadir más instancias de los microservicios mediante balanceadores de carga.
- **Almacenamiento en caché**: para reducir el número de consultas a la base de datos.
- **Optimización de base de datos**: mejorar las consultas para reducir tiempos de respuesta.