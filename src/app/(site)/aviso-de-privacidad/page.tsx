import type { Metadata } from "next";
import { empresa } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad integral de Prolimp del Centro conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "12 de octubre de 2026";
const LEGAL_NAME = "Prolimp del Centro, S.A. de C.V.";
const SECRETARIA_URL = "https://www.gob.mx/buengobierno";
const REPEP_URL = "https://repep.profeco.gob.mx";

function Mail() {
  return <a href={`mailto:${empresa.email}`}>{empresa.email}</a>;
}

export default function AvisoPrivacidadPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Legal</span>
          <h1>Aviso de privacidad integral</h1>
          <p className={styles.updated}>Última actualización: {LAST_UPDATED}</p>
        </header>

        <section className={styles.section}>
          <h2>1. Responsable del tratamiento de tus datos</h2>
          <p>
            <strong>{LEGAL_NAME}</strong> (en adelante, «{empresa.nombre}»), con
            domicilio en Xalapa, Veracruz, México, es responsable del tratamiento
            de tus datos personales y de su protección, conforme a la Ley Federal
            de Protección de Datos Personales en Posesión de los Particulares (en
            adelante, la «Ley»).
          </p>
          <p>
            Nuestra área de datos personales atiende cualquier duda o solicitud
            relacionada con este aviso en el correo <Mail />.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Datos personales que tratamos</h2>
          <p>Según la forma en que te relaciones con nosotros, tratamos:</p>
          <ul>
            <li>
              <strong>Datos de identificación y contacto:</strong> nombre y
              apellido, correo electrónico, teléfono, celular o WhatsApp, y ciudad.
            </li>
            <li>
              <strong>Datos comerciales:</strong> empresa, giro, si ya distribuyes
              o comercializas productos, y los productos o servicios de tu interés.
            </li>
            <li>
              <strong>Datos de pedido y facturación:</strong> domicilio de entrega,
              razón social, RFC, régimen y domicilio fiscal, cuando realizas un
              pedido o solicitas factura.
            </li>
            <li>
              <strong>Datos de navegación:</strong> dirección IP, tipo de
              dispositivo y navegador, páginas visitadas e identificadores de
              cookies (ver sección 8).
            </li>
          </ul>
          <p>
            <strong>No tratamos datos personales sensibles</strong> y este sitio
            no recaba datos financieros ni patrimoniales. Te pedimos no incluir ese
            tipo de información en los formularios ni en los mensajes que nos
            envíes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Cómo obtenemos tus datos</h2>
          <ul>
            <li>
              Directamente de ti, cuando llenas el formulario para ser distribuidor
              (que se envía por WhatsApp) o te suscribes al boletín en este sitio.
            </li>
            <li>
              Cuando nos contactas por WhatsApp, teléfono, correo electrónico o
              redes sociales, o en nuestras sucursales y tiendas.
            </li>
            <li>
              De forma automática, mediante cookies y tecnologías similares al
              navegar por el sitio.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Finalidades del tratamiento</h2>
          <p>
            <strong>Finalidades primarias</strong> (necesarias para atenderte y
            cumplir la relación que tengas con nosotros; no requieren tu
            consentimiento):
          </p>
          <ul>
            <li>Responder tus solicitudes de información, cotización y contacto comercial.</li>
            <li>Evaluar y dar seguimiento a las solicitudes para ser distribuidor.</li>
            <li>Procesar pedidos, coordinar entregas y dar seguimiento a tus compras.</li>
            <li>Emitir facturas, gestionar pagos y cumplir obligaciones fiscales.</li>
            <li>Brindar soporte técnico, atención posventa y atender aclaraciones.</li>
          </ul>
          <p>
            <strong>Finalidades secundarias</strong> (no son necesarias para
            atenderte y requieren tu consentimiento):
          </p>
          <ul>
            <li>Enviarte el boletín, promociones y novedades por correo o WhatsApp.</li>
            <li>Realizar encuestas de satisfacción.</li>
            <li>
              Medir el uso del sitio y mostrarte publicidad de {empresa.nombre} en
              otras plataformas.
            </li>
          </ul>
          <p>
            Si no quieres que tus datos se usen para las finalidades secundarias,
            escríbenos a <Mail /> indicándolo. Tu negativa no afecta los productos
            o servicios que tengas contratados ni los que solicites.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Consentimiento</h2>
          <p>
            Al proporcionarnos tus datos después de tener este aviso a tu
            disposición, y mientras no manifiestes tu oposición, se entiende que
            consientes su tratamiento en los términos aquí descritos, conforme al
            artículo 7 de la Ley. La suscripción al boletín es voluntaria y puedes
            cancelarla en cualquier momento.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Con quién compartimos tus datos</h2>
          <p>
            <strong>
              No vendemos, rentamos ni cedemos tus datos personales a terceros para
              que los usen con fines propios.
            </strong>{" "}
            Si en el futuro necesitáramos una transferencia que requiera tu
            consentimiento, te lo pediremos antes de realizarla.
          </p>
          <p>
            Para operar utilizamos proveedores que tratan datos por nuestra cuenta
            y bajo nuestras instrucciones (encargados), algunos de ellos ubicados
            fuera de México: alojamiento del sitio, gestor de contenidos,
            mensajería, paqueterías para la entrega de pedidos, y servicios de
            medición y publicidad digital.
          </p>
          <p>
            Además, la Ley permite transferir datos sin tu consentimiento en los
            supuestos de su artículo 36, entre ellos: a sociedades del mismo grupo
            que operen bajo los mismos procesos y políticas internas; a las
            autoridades competentes cuando exista obligación legal o mandato
            fundado; y cuando sea necesario para cumplir la relación que tienes con
            nosotros.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Derechos ARCO, revocación y limitación de uso</h2>
          <p>
            Tienes derecho a <strong>acceder</strong> a los datos personales que
            tenemos de ti, <strong>rectificarlos</strong> si son inexactos o están
            incompletos, <strong>cancelarlos</strong> cuando consideres que no se
            tratan conforme a la Ley, y <strong>oponerte</strong> a su tratamiento
            por causa legítima (derechos ARCO). También puedes{" "}
            <strong>revocar el consentimiento</strong> que nos hayas dado, sin
            efectos retroactivos.
          </p>
          <p>
            Para ejercerlos, tú o tu representante legal deben enviar una solicitud
            a <Mail /> con lo siguiente:
          </p>
          <ol>
            <li>Tu nombre y un domicilio o correo electrónico para recibir la respuesta.</li>
            <li>
              Copia de un documento que acredite tu identidad y, en su caso, la
              personalidad e identidad de tu representante.
            </li>
            <li>
              La descripción clara y precisa de los datos sobre los que quieres
              ejercer el derecho (no es necesaria en solicitudes de acceso).
            </li>
            <li>El derecho que quieres ejercer o lo que solicitas.</li>
            <li>
              Cualquier otro elemento que ayude a localizar tus datos. En
              solicitudes de rectificación, indica las modificaciones y adjunta la
              documentación que las sustente.
            </li>
          </ol>
          <p>
            Te comunicaremos nuestra determinación en un plazo máximo de{" "}
            <strong>veinte días</strong> contados desde que recibamos tu solicitud
            y, si procede, la haremos efectiva dentro de los{" "}
            <strong>quince días</strong> siguientes. La Ley permite ampliar estos
            plazos una sola vez por un periodo igual cuando el caso lo justifique.
            Responderemos por correo electrónico; en solicitudes de acceso, la
            información se entrega en documento electrónico.
          </p>
          <p>
            El ejercicio de estos derechos es gratuito; solo podrían cobrarse los
            gastos de reproducción, copias o envío. No en todos los casos podremos
            cancelar tus datos de inmediato, ya que algunas obligaciones legales
            nos exigen conservarlos.
          </p>
          <p>
            <strong>Para limitar el uso o divulgación de tus datos</strong> puedes:
            pedirnos por correo que dejemos de contactarte con fines promocionales,
            cancelar tu suscripción al boletín, rechazar las cookies no esenciales
            (sección 8) o inscribirte en el Registro Público para Evitar Publicidad
            de la Profeco (
            <a href={REPEP_URL} target="_blank" rel="noopener noreferrer">repep.profeco.gob.mx</a>).
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Cookies y tecnologías de rastreo</h2>
          <p>
            Este sitio utiliza cookies y tecnologías similares para funcionar
            correctamente, medir el tráfico y evaluar nuestras campañas. A través
            de Google Tag Manager se cargan herramientas de analítica y publicidad
            de Google y de Meta, que recaban datos de navegación como tu dirección
            IP, tu dispositivo, las páginas que visitas y un identificador de
            cookie.
          </p>
          <p>
            Puedes desactivar las cookies de medición y publicidad con el botón{" "}
            <strong>«Rechazar»</strong> del aviso de cookies: a partir de ese
            momento dejamos de cargar esas herramientas en tu navegador. También
            puedes bloquear o eliminar las cookies desde la configuración de tu
            navegador; si lo haces, algunas funciones del sitio podrían verse
            afectadas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Decisiones automatizadas</h2>
          <p>
            No tomamos decisiones que produzcan efectos jurídicos o te afecten de
            manera significativa con base únicamente en el tratamiento automatizado
            de tus datos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Conservación y seguridad</h2>
          <p>
            Conservamos tus datos solo durante el tiempo necesario para las
            finalidades descritas y para cumplir las obligaciones legales
            aplicables; después se bloquean y se suprimen. Mantenemos medidas de
            seguridad administrativas, técnicas y físicas para protegerlos contra
            daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no
            autorizado.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Cambios a este aviso</h2>
          <p>
            Podemos actualizar este aviso por cambios legales, en nuestros
            productos y servicios o en nuestras prácticas de privacidad. La versión
            vigente estará siempre publicada en esta página, con su fecha de última
            actualización. Si el cambio modifica las finalidades o implica nuevas
            transferencias que requieran tu consentimiento, te lo comunicaremos por
            correo electrónico o mediante un aviso visible en el sitio antes de
            aplicarlo.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Autoridad</h2>
          <p>
            Si consideras que tu derecho a la protección de datos personales fue
            vulnerado, o no recibes respuesta a tu solicitud, puedes presentar una
            solicitud de protección de datos ante la{" "}
            <strong>Secretaría Anticorrupción y Buen Gobierno</strong> dentro de
            los quince días siguientes a la fecha en que te comuniquemos nuestra
            respuesta, o a partir de que venza el plazo que tenemos para responder.
            Más información en{" "}
            <a href={SECRETARIA_URL} target="_blank" rel="noopener noreferrer">gob.mx/buengobierno</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
