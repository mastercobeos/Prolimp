import { empresa } from "@/lib/content";
import styles from "./page.module.css";

type Props = {
  legalName: string;
  address: string;
};

function Mail() {
  return <a href={`mailto:${empresa.email}`}>{empresa.email}</a>;
}

export default function PrivacyNotice({ legalName, address }: Props) {
  return (
    <>
      <section className={styles.section}>
        <h2>1. Identidad y domicilio del responsable</h2>
        <p>
          <strong>{legalName}</strong> (en adelante “{empresa.nombre}”), con
          domicilio en {address}, es responsable del tratamiento de tus datos
          personales. Puedes contactarnos al correo <Mail /> para cualquier duda
          relacionada con este aviso.
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Datos personales que recabamos</h2>
        <p>Para las finalidades descritas en este aviso podemos recabar los siguientes datos:</p>
        <ul>
          <li>Nombre completo</li>
          <li>Correo electrónico</li>
          <li>Número telefónico y/o WhatsApp</li>
          <li>Nombre de tu empresa</li>
          <li>Dirección física (para envíos y facturación)</li>
          <li>RFC (para facturación)</li>
        </ul>
        <p>
          <strong>No recabamos datos personales sensibles ni datos financieros.</strong>
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. Finalidades del tratamiento</h2>
        <p>
          <strong>Finalidades primarias</strong> (necesarias para la relación con{" "}
          {empresa.nombre}):
        </p>
        <ul>
          <li>Atender solicitudes de cotización y contacto comercial.</li>
          <li>Procesar y dar seguimiento a pedidos de productos.</li>
          <li>Emitir facturas y comprobantes fiscales.</li>
          <li>Coordinar entregas y logística de envíos.</li>
          <li>Brindar soporte técnico y post-venta.</li>
        </ul>
        <p>
          <strong>Finalidades secundarias</strong> (requieren tu consentimiento):
        </p>
        <ul>
          <li>Enviar promociones, boletines y novedades por email o WhatsApp.</li>
          <li>Encuestas de satisfacción y mejora del servicio.</li>
        </ul>
        <p>
          Si no deseas que tus datos sean usados para las finalidades secundarias,
          envíanos un correo a <Mail />.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. Transferencia de datos</h2>
        <p>
          {empresa.nombre} no transfiere tus datos personales a terceros salvo
          cuando sea estrictamente necesario para cumplir con la relación
          comercial (por ejemplo, paqueterías para envíos) o para cumplir
          obligaciones legales.{" "}
          <strong>En ningún caso comercializamos, vendemos o rentamos tus datos.</strong>
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Derechos ARCO</h2>
        <p>
          Como titular de tus datos, tienes derecho a <strong>Acceder</strong>,{" "}
          <strong>Rectificar</strong>, <strong>Cancelar</strong> u{" "}
          <strong>Oponerte</strong> al tratamiento de los mismos (derechos ARCO),
          así como a revocar el consentimiento que nos hayas otorgado. Para
          ejercer cualquiera de estos derechos, envía tu solicitud al correo{" "}
          <Mail /> con la siguiente información:
        </p>
        <ul>
          <li>Nombre completo y datos de contacto del titular.</li>
          <li>Copia de identificación oficial.</li>
          <li>Descripción clara del derecho que deseas ejercer y los datos involucrados.</li>
        </ul>
        <p>
          Responderemos tu solicitud en un plazo máximo de{" "}
          <strong>20 días hábiles</strong>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Uso de cookies y tecnologías de rastreo</h2>
        <p>
          Nuestro sitio web utiliza cookies y tecnologías similares para mejorar
          tu experiencia de navegación, medir el tráfico y personalizar el
          contenido. Puedes configurar tu navegador para bloquear o eliminar las
          cookies en cualquier momento; sin embargo, algunas funcionalidades del
          sitio podrían verse afectadas.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. Modificaciones al aviso de privacidad</h2>
        <p>
          {empresa.nombre} se reserva el derecho de actualizar o modificar este
          aviso de privacidad en cualquier momento. Los cambios se publicarán en
          esta misma página, indicando la fecha de última actualización. Te
          recomendamos revisar periódicamente esta sección.
        </p>
      </section>

      <section className={styles.section}>
        <h2>8. Autoridad</h2>
        <p>
          Si consideras que tu derecho a la protección de datos personales ha sido
          vulnerado, puedes acudir al Instituto Nacional de Transparencia, Acceso
          a la Información y Protección de Datos Personales (INAI) en
          www.inai.org.mx.
        </p>
      </section>
    </>
  );
}
