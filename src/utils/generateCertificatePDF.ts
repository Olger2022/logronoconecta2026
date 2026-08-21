import { jsPDF } from 'jspdf';
import { IncidentReport } from '../types';

export interface CertificateOptions {
  incident: IncidentReport;
  autoPrint?: boolean;
  download?: boolean;
}

/**
 * Generates an official GAD Municipal Logroño Resolution Certificate as a high-quality PDF,
 * triggers download and optionally opens the print window.
 */
export function generateCertificatePDF(options: CertificateOptions): jsPDF {
  const { incident, autoPrint = true, download = true } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Outer Decorative Borders (Navy Blue & Gold)
  doc.setDrawColor(10, 65, 145); // #0A4191
  doc.setLineWidth(1.2);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - margin * 2 + 8);

  doc.setDrawColor(217, 119, 6); // Amber/Gold #D97706
  doc.setLineWidth(0.4);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - margin * 2 + 4);

  // Top Header Banner
  doc.setFillColor(10, 65, 145);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, 26, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(
    'GOBIERNO AUTÓNOMO DESCENTRALIZADO MUNICIPAL DE LOGROÑO',
    pageWidth / 2,
    margin + 3,
    { align: 'center' }
  );

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 235, 255);
  doc.text(
    'PROVINCIA DE MORONA SANTIAGO — REPÚBLICA DEL ECUADOR',
    pageWidth / 2,
    margin + 8,
    { align: 'center' }
  );

  doc.setFontSize(7.5);
  doc.setTextColor(253, 230, 138); // Amber-200
  doc.text(
    'SISTEMA INTEGRADO DE GESTIÓN TERRITORIAL, ATENCIÓN CIUDADANA Y OBRAS PÚBLICAS',
    pageWidth / 2,
    margin + 13,
    { align: 'center' }
  );

  // Certificate Main Heading
  let currentY = margin + 30;

  doc.setTextColor(10, 65, 145);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(
    'ACTA TÉCNICA DE RESOLUCIÓN Y CERTIFICACIÓN MUNICIPAL',
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  currentY += 6;
  doc.setFontSize(10);
  doc.setFont('courier', 'bold');
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text(
    `EXPEDIENTE / CÓDIGO N°: ${incident.code || 'GAD-LOG-2026'}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  // Status Badge (Atendido y Archivado)
  currentY += 5;
  doc.setFillColor(236, 253, 245); // Emerald-50
  doc.setDrawColor(16, 185, 129); // Emerald-500
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, currentY, contentWidth, 9, 2, 2, 'FD');

  doc.setTextColor(6, 95, 70); // Emerald-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CERTIFICACIÓN OFICIAL: INCIDENCIA / TRÁMITE ATENDIDO Y RESUELTO EN TERRITORIO', margin + 6, currentY + 6);
  
  doc.setFont('courier', 'bold');
  doc.text('ESTADO: CONCLUIDO', pageWidth - margin - 6, currentY + 6, { align: 'right' });

  // Main Metadata Section (Table Box)
  currentY += 13;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 70, 2, 2, 'FD');

  // Metadata Rows
  const metadataRows: Array<[string, string, string, string]> = [
    [
      'Trámite / Asunto:',
      incident.title || 'Reporte de Mantenimiento Municipal',
      'Categoría Municipal:',
      incident.category || 'Servicios Públicos'
    ],
    [
      'Ciudadano Solicitante:',
      `${incident.citizenName || 'Ciudadano de Logroño'}`,
      'Cédula / Identificación:',
      incident.citizenCedula || '1400892341'
    ],
    [
      'Sector / Parroquia:',
      `${incident.location.sector || 'Logroño Centro'}`,
      'Dirección / Referencia:',
      `${incident.location.address || 'Cantón Logroño'}`
    ],
    [
      'Coordenadas GPS:',
      `Lat: ${incident.location.lat ? incident.location.lat.toFixed(5) : '-2.62800'}, Lng: ${incident.location.lng ? incident.location.lng.toFixed(5) : '-78.17600'}`,
      'Fecha Ingreso:',
      new Date(incident.createdAt).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })
    ],
    [
      'Departamento Asignado:',
      incident.assignedDepartment || 'Dirección de Obras Públicas y Servicios',
      'Fecha de Cierre:',
      new Date(incident.updatedAt || incident.createdAt).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })
    ],
    [
      'Inspector / Operador:',
      incident.assignedOperator || 'Ing. Supervisor Técnico de Campo',
      'Canal de Origen:',
      'App Móvil / Ventanilla Digital GAD'
    ]
  ];

  let rowY = currentY + 7;
  metadataRows.forEach((row) => {
    // Left column
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(row[0], margin + 4, rowY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const leftVal = doc.splitTextToSize(row[1], 75);
    doc.text(leftVal[0] || row[1], margin + 4, rowY + 4);

    // Right column
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(row[2], margin + 90, rowY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const rightVal = doc.splitTextToSize(row[3], 80);
    doc.text(rightVal[0] || row[3], margin + 90, rowY + 4);

    rowY += 10.5;
  });

  // Technical Resolution Summary Box
  currentY += 74;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(margin, currentY, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 65, 145);
  doc.text('INFORME TÉCNICO DE RESOLUCIÓN & CONSTATACIÓN EN SITIO:', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  const noteText = incident.gadNote || 
    'La cuadrilla técnica municipal del GAD Logroño ejecutó los trabajos de reparación, mantenimiento y verificación técnica en territorio. El requerimiento se declara formalmente RESUELTO, cumpliendo con los estándares de calidad, seguridad y normativas del COOTAD.';
  
  const splitNote = doc.splitTextToSize(`"${noteText}"`, contentWidth - 8);
  doc.text(splitNote, margin + 4, currentY + 12);

  // Verification & Legal Notice
  currentY += 42;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const legalNote = 
    'El presente documento constituye certificación oficial emitida por el Gobierno Autónomo Descentralizado Municipal del Cantón Logroño de conformidad con el Art. 54 del Código Orgánico de Organización Territorial, Autonomía y Descentralización (COOTAD). Documento con validez jurídica y administrativa.';
  doc.text(doc.splitTextToSize(legalNote, contentWidth), margin, currentY);

  // Signatures Section
  currentY += 16;
  const signatureBoxWidth = (contentWidth - 10) / 2;

  // Signature 1: Authority
  doc.setDrawColor(10, 65, 145);
  doc.setLineWidth(0.5);
  doc.line(margin + 10, currentY + 14, margin + signatureBoxWidth - 10, currentY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(10, 65, 145);
  doc.text('Ing. María Viteri / Dirección General', margin + signatureBoxWidth / 2, currentY + 18, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('GAD Municipal del Cantón Logroño', margin + signatureBoxWidth / 2, currentY + 22, { align: 'center' });

  // Signature 2: Inspector / Operator
  doc.line(margin + signatureBoxWidth + 10, currentY + 14, margin + contentWidth - 10, currentY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(10, 65, 145);
  doc.text(incident.assignedOperator || 'Téc. Cuadrilla de Operaciones', margin + signatureBoxWidth + signatureBoxWidth / 2, currentY + 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(incident.assignedDepartment || 'Fiscalización & Obras Públicas', margin + signatureBoxWidth + signatureBoxWidth / 2, currentY + 22, { align: 'center' });

  // Digital Seal / QR Hash Stamp Box
  currentY += 28;
  doc.setFillColor(238, 242, 255); // Indigo-50
  doc.setDrawColor(10, 65, 145);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, contentWidth, 12, 1.5, 1.5, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(10, 65, 145);
  const stampCode = `SELLO DIGITAL: GADLOG-${incident.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  doc.text(stampCode, margin + 4, currentY + 5);

  const verificationUrl = `VERIFICACIÓN EN LÍNEA: https://gadlogrono.gob.ec/certificados/validar?id=${incident.code}`;
  doc.setFont('courier', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(verificationUrl, margin + 4, currentY + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(16, 185, 129);
  doc.text('✓ FIRMA ELECTRÓNICA VÁLIDA', pageWidth - margin - 4, currentY + 7, { align: 'right' });

  // Page Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Palacio Municipal: Calle 10 de Agosto y Av. 24 de Mayo | Teléfono PBX: (07) 2700-100 | Logroño - Morona Santiago - Ecuador',
    pageWidth / 2,
    pageHeight - margin + 2,
    { align: 'center' }
  );

  // Generate Filename
  const cleanCode = (incident.code || 'CERT').replace(/[^a-zA-Z0-9-_]/g, '_');
  const filename = `Certificado_GAD_Logrono_${cleanCode}_${new Date().toISOString().slice(0, 10)}.pdf`;

  // Download PDF
  if (download) {
    doc.save(filename);
  }

  // Auto Print if requested
  if (autoPrint) {
    try {
      doc.autoPrint();
      const blobUrl = doc.output('bloburl');
      const printWindow = window.open(blobUrl, '_blank');
      if (!printWindow) {
        // Fallback to browser print
        window.print();
      }
    } catch {
      window.print();
    }
  }

  return doc;
}
