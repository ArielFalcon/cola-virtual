<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&color=F75C7E&size=28&center=true&vCenter=true&width=600&height=100&lines=Cola+Virtual%3A+El+Experimento+Social;Hecho+con+la+urgencia+de+un+cubano...;%C2%A1El+%C3%BAltimo+que+llegue+es+familia+del+director!;" alt="Cola Virtual Typing SVG">
</div>

<p align="center">
  <strong>Un proyecto nacido de la prisa, la necesidad y el humor. Porque si hay algo que entendemos, es cómo hacer una cola.</strong>
</p>
<br/>

## 🌴 ¿De qué va esto?

Esta es una aplicación web simple, construida a la velocidad en que se va la luz, que implementa una fila virtual de juguete. La idea es sencilla: si alguna vez has sentido la necesidad ciudadana de "mandar a alguien para urgencias", este es tu repo.

El proyecto es, en esencia, un juego y una broma interna para la comunidad cubana. No se toma muy en serio a sí mismo, y por lo tanto, la seguridad y la persistencia de los datos son... digamos que "relajadas".

## 🛠️ Stack Tecnológico

<p align="center">
  <a href="https://astro.build/">
    <img src="https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white" alt="Astro">
  </a>
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/tailwind%20css-%2306B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  </a>
    <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  </a>
</p>

## ✨ Características Clave

-   **⚡ IP Throttling:** Para prevenir que los "coleros" digitales hagan de las suyas, el sistema utiliza un `rate limiter` a nivel de middleware. Cada IP tiene un cupo de peticiones para mantener el orden. Esta funcionalidad se implementa con la velocidad de [Upstash Redis](https://upstash.com/redis).
-   **💳 Pagos con Stripe:** Aunque es un juego, el proyecto está preparado para el capitalismo de verdad, integrando [Stripe](https://stripe.com/) como pasarela de pagos.
-   **🚀 Despliegue en el Edge:** Servido globalmente a través de Vercel para una latencia mínima, porque ni la cola virtual puede ser lenta.


## 🚀 Puesta en Marcha

Si quieres clonar esto y echar a andar tu propia cola virtual para resolver los problemas de tu barrio:

1.  **🍴 Clona el repositorio:** `git clone https://github.com/ArielFalcon/ColaVirtual.git`
2.  **📦 Instala las dependencias:** `npm install`
3.  **🔥 Crea un proyecto en Firebase:** Activa Firestore para guardar los datos de la cola.
4.  **🔑 Genera una clave de servicio:** Descarga el archivo `.json` de tu cuenta de servicio de Firebase.
5.  **🤫 Configura tus secretos:** Crea un archivo `.env` en la raíz y añade la clave con el formato `FIREBASE_SERVICE_ACCOUNT_KEY='<contenido_del_json_en_una_sola_linea>'`. ¡No te olvides de las claves de Upstash y Stripe!
6.  **🏃‍♂️ Ejecuta el servidor de desarrollo:** `npm run dev`

---

<div align="center">
  <small>Este proyecto fue construido sobre una plantilla de Astro creada por <a href="https://github.com/michael-andreuzza">Michael Andreuzza</a>. ¡Gracias por la base!</small>
</div>
