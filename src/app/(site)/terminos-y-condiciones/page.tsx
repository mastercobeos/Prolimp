import type { Metadata } from "next";
import styles from "../aviso-de-privacidad/page.module.css";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso del sitio web y compra de productos Prolimp del Centro.",
  robots: { index: true, follow: true },
};

export default function TerminosYCondicionesPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Legal</span>
          <h1>Términos y condiciones</h1>
          <p className={styles.updated}>Última actualización: enero 2026</p>
        </header>

        <section className={styles.section}>
          <h2>1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar el sitio web <strong>www.prolimp.com</strong> (en adelante,
            &ldquo;el Sitio&rdquo;), operado por <strong>Prolimp del Centro, S.A. de C.V.</strong>{" "}
            (&ldquo;Prolimp&rdquo;), aceptas cumplir con los presentes términos y condiciones.
            Si no estás de acuerdo con alguno de ellos, te pedimos no utilizar el Sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Uso del sitio</h2>
          <p>El Sitio está destinado a proporcionar información sobre productos y servicios de limpieza profesional. El uso está permitido para:</p>
          <ul>
            <li>Consultar información y fichas técnicas de productos.</li>
            <li>Solicitar cotizaciones y contactar al equipo comercial.</li>
            <li>Descargar catálogos y material técnico público.</li>
            <li>Suscribirte al boletín informativo.</li>
          </ul>
          <p>
            Queda prohibido el uso del Sitio para fines ilícitos, para dañar su funcionamiento,
            enviar spam, o para replicar/comercializar el contenido sin autorización expresa.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Propiedad intelectual</h2>
          <p>
            Todos los contenidos del Sitio (textos, imágenes, logos, gráficos, marcas,
            nombres comerciales, código fuente y diseño) son propiedad de{" "}
            <strong>Prolimp del Centro, S.A. de C.V.</strong> o de sus respectivos titulares
            aliados (Rubbermaid, Kimberly-Clark, Castor, Wiese, SCF, 3M, etc.) y están
            protegidos por las leyes mexicanas e internacionales de propiedad intelectual.
          </p>
          <p>
            No está permitida su reproducción, distribución, modificación o uso comercial sin
            autorización previa por escrito.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Productos, precios y disponibilidad</h2>
          <ul>
            <li>Los precios mostrados en el Sitio son referenciales y pueden cambiar sin previo aviso.</li>
            <li>La disponibilidad de productos está sujeta a inventario en el momento de la cotización.</li>
            <li>Las imágenes de producto son ilustrativas; ligeras variaciones de color, envase o presentación pueden aplicar.</li>
            <li>Las cotizaciones formales se emiten por escrito con vigencia definida (típicamente 15 días naturales).</li>
            <li>Los productos con enlace de compra externo son vendidos bajo las políticas de la plataforma externa correspondiente; consulta los términos de esa plataforma para envíos, devoluciones y garantías de esos casos.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Pedidos y facturación</h2>
          <p>
            Los pedidos generados a través de cotización directa con Prolimp requieren:
          </p>
          <ul>
            <li>Confirmación por escrito (email o WhatsApp) por parte del cliente.</li>
            <li>Datos completos para facturación (razón social, RFC, uso CFDI, régimen fiscal, dirección).</li>
            <li>Anticipo o pago total según la modalidad acordada.</li>
          </ul>
          <p>Prolimp emite factura electrónica CFDI conforme al SAT.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Envíos y entregas</h2>
          <p>
            Los tiempos y costos de envío se cotizan por pedido según ubicación y volumen.
            Prolimp cuenta con red de sucursales y distribuidores autorizados; la entrega
            puede realizarse directo desde la sucursal más cercana. Los tiempos son
            estimados y pueden verse afectados por causas ajenas (clima, paqueterías,
            demanda estacional).
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Devoluciones y garantía</h2>
          <p>
            Los productos Prolimp cuentan con garantía de fabricación. En caso de defecto
            comprobable, se sustituye el producto o se reembolsa dentro de los 30 días
            posteriores a la compra. La garantía no cubre:
          </p>
          <ul>
            <li>Mal uso, aplicación fuera de las indicaciones técnicas.</li>
            <li>Producto usado parcialmente sin defecto comprobable.</li>
            <li>Envases dañados por manipulación posterior a la entrega.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Uso seguro de químicos</h2>
          <p>
            Los productos químicos de limpieza deben usarse siguiendo las instrucciones de
            la ficha técnica y hoja de datos de seguridad (HDS) de cada producto. El
            cliente es responsable de:
          </p>
          <ul>
            <li>Almacenar los productos en lugares ventilados, fuera del alcance de menores.</li>
            <li>Usar equipo de protección personal (EPP) al manipular concentrados.</li>
            <li>Respetar las diluciones recomendadas.</li>
            <li>No mezclar productos entre sí salvo indicación explícita.</li>
          </ul>
          <p>
            Prolimp no se hace responsable por daños derivados del uso incorrecto de los
            productos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Limitación de responsabilidad</h2>
          <p>
            Prolimp no será responsable por daños indirectos, incidentales o consecuentes
            derivados del uso del Sitio o de los productos. La responsabilidad máxima de
            Prolimp queda limitada al valor del producto adquirido.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Modificaciones</h2>
          <p>
            Prolimp puede modificar estos términos en cualquier momento. Los cambios se
            publicarán en esta página con fecha de actualización. Se recomienda revisar
            periódicamente esta sección.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.
            Cualquier controversia se someterá a los tribunales competentes de la ciudad de
            Xalapa, Veracruz, renunciando las partes a cualquier otro fuero.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Contacto</h2>
          <p>
            Para dudas sobre estos términos, escríbenos a{" "}
            <a href="mailto:contacto@prolimp.com">contacto@prolimp.com</a> o llámanos al{" "}
            <a href="https://wa.me/5212291406981" target="_blank" rel="noopener noreferrer">
              WhatsApp +52 229 140 6981
            </a>.
          </p>
        </section>
      </article>
    </main>
  );
}
