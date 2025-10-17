const SuicideAssessment = require('../models/suicideAssessment'); // Asegúrate de que esta ruta sea correcta
const PDFDocument = require('pdfkit');

// Helper para formatear booleano
const formatBool = (value) => (value === true ? "SÍ" : "NO");

// Colores para la nueva estética clínica
const primaryColor = '#0F3A60'; // Azul Clínico Oscuro (Títulos principales)
const accentColor = '#4A90E2'; // Azul de Énfasis (Subtítulos, resaltados)
const highlightColor = '#729ACB'; // Nuevo color azul más suave para las respuestas y detalles
const backgroundColor = '#FFFFFF'; // Fondo blanco puro

// Helper para renderizar campos booleanos con descripción y total de intentos
const renderField = (doc, title, field) => {
    if (!field || field.present === undefined) return;

    const isPresent = field.present === true;
    const answerText = formatBool(isPresent);

    // 1. Título de la pregunta (Ahora en negrita y un poco más grande: 13pt)
    doc.font('Helvetica-Bold')
       .fontSize(13)
       .fillColor('black')
       .text(`• ${title}: `, { indent: 50, continued: true });
    
    // 2. Respuesta (Resaltada en negrita y el nuevo color de énfasis más suave)
    doc.font('Helvetica-Bold')
       .fillColor(highlightColor)
       .text(answerText, { continued: true });
    
    // Volver al tamaño de fuente estándar (12pt)
    doc.fontSize(12);

    let detail = [];
    
    // Se cambia 'Detalle de la Declaración' por 'Descripción'
    if (isPresent && field.description) {
        // La etiqueta "Descripción" va en negrita
        detail.push(`Descripción: ${field.description}`);
    }
    if (field.totalAttempts !== undefined) {
        // La etiqueta "Total de Intentos" va en negrita
        detail.push(`Total de Intentos: ${field.totalAttempts}`);
    }

    if (detail.length > 0) {
        // 3. Detalles (Resaltados y entre paréntesis)
        // Se separa la cadena para dar formato a la etiqueta y al valor
        const formattedDetails = detail.map(d => {
            const parts = d.split(':');
            if (parts.length > 1) {
                // Aplica negrita solo a la etiqueta (Descripción/Total de Intentos)
                return `${parts[0]}: ${parts.slice(1).join(':').trim()}`;
            }
            return d;
        }).join(' | ');

        // Se usa un bloque de texto que maneja múltiples estilos para los detalles
        doc.text(' (', { continued: true, font: 'Times-Roman', fillColor: 'black' });
        
        detail.forEach((d, index) => {
             const parts = d.split(':');
             if (parts.length > 1) {
                // Etiqueta en Negrita
                doc.font('Helvetica-Bold').fillColor('black').text(parts[0], { continued: true, baseline: 'sub' });
                doc.font('Times-Roman').fillColor('black').text(': ', { continued: true, baseline: 'sub' });
                // Valor en Azul Suave
                doc.font('Helvetica-Bold').fillColor(highlightColor).text(parts.slice(1).join(':').trim(), { continued: true, baseline: 'sub' });
             } else {
                 doc.font('Helvetica-Bold').fillColor(highlightColor).text(d, { continued: true, baseline: 'sub' });
             }
             if (index < detail.length - 1) {
                doc.font('Times-Roman').fillColor('black').text(' | ', { continued: true, baseline: 'sub' });
             }
        });

        doc.font('Times-Roman').fillColor('black').text(')', { continued: false });
    } else {
        doc.text(''); // Finaliza la línea y baja
    }
    doc.moveDown(0.2);
    // Volver a la fuente y color base
    doc.font('Times-Roman').fillColor('black').fontSize(12);
};

// Helper para renderizar un título de subsección estandarizado
const renderSubSectionTitle = (doc, title) => {
    doc.moveDown(0.7)
        .font('Helvetica-Bold')
        .fontSize(14) // Tamaño estandarizado para subtítulos
        .fillColor(accentColor) // Azul de énfasis
        .text(title, { align: 'left', indent: 30 })
        .moveDown(0.3)
        .font('Times-Roman')
        .fontSize(12)
        .fillColor('black');
};


const generateAssessmentReportPDF = async (req, res) => {
    try {
        const assessmentId = req.params.id;


        // Buscar la evaluación...
        const assessment = await SuicideAssessment.findById(assessmentId)
            .populate('student', 'firstName lastName email') // Popula la información del estudiante
            .populate('psychologist', 'firstName lastName email'); // Popula la información del psicólogo

        if (!assessment) {
            return res.status(404).json({ msg: 'Evaluación de riesgo suicida no encontrada' });
        }

        // Configuración del documento PDF
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Title: `Reporte de Evaluación Suicida - ${assessment.student.firstName} ${assessment.student.lastName}`,
            }
        });

        // Configurar las cabeceras de la respuesta HTTP para el PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="evaluacion_suicida_${assessment.student.firstName}_${assessment.student.lastName}_${new Date(assessment.date).toLocaleDateString('es-ES')}.pdf"`);
        doc.pipe(res);

        // --- Estilos Base (Temática Clínica) ---

        doc.rect(0, 0, doc.page.width, doc.page.height).fill(backgroundColor); 
        doc.fillColor('black');
        doc.font('Times-Roman'); // Fuente general
        
        // Función para dibujar el encabezado en cada página
        doc.on('pageAdded', () => {
            doc.rect(0, 0, doc.page.width, doc.page.height).fill(backgroundColor);
            doc.fillColor(primaryColor)
                .fontSize(10)
                .font('Helvetica')
                .text(`Reporte de Evaluación - ${assessment.student.firstName} ${assessment.student.lastName}`, 50, 30);
            doc.fillColor('black');
        });

        // Título principal estilizado (24pt)
        doc.fillColor(primaryColor)
            .fontSize(24)
            .font('Helvetica-Bold')
            .text('Detalles de Evaluación de Riesgo Suicida', { align: 'center' })
            .moveDown(1.5);

        // --- Información General de la Evaluación ---
        doc.fillColor(primaryColor)
            .fontSize(18) // Título de sección (18pt)
            .text('Información General', { align: 'left', indent: 20 })
            .moveDown(0.5);

        doc.fontSize(13).font('Times-Roman').fillColor('black');
        
        const generalInfo = [
            { label: 'Estudiante', value: `${assessment.student.firstName} ${assessment.student.lastName}` },
            { label: 'Correo Estudiante', value: assessment.student.email },
            { label: 'Psicólogo Evaluador', value: `${assessment.psychologist?.firstName ?? 'N/A'} ${assessment.psychologist?.lastName ?? ''}` },
            { label: 'Correo del Evaluador', value: assessment.psychologist?.email ?? 'N/A' },
            { label: 'Fecha de Evaluación', value: new Date(assessment.date).toLocaleDateString('es-ES') },
            { label: 'Nivel de Riesgo Calculado (Final)', value: assessment.riskLevel },
            { label: 'Observaciones Generales', value: assessment.observations || 'Ninguna' }
        ];

        generalInfo.forEach(item => {
            doc.text(`${item.label}: `, { indent: 20, continued: true, font: 'Helvetica-Bold' })
                .font('Times-Roman')
                .text(item.value);
            doc.moveDown(0.1);
        });
        doc.moveDown(1);
        
        // --- Sección 1: Ideación Suicida ---
        doc.fillColor(primaryColor)
            .fontSize(18) // Título de sección (18pt)
            .font('Helvetica-Bold')
            .text('1. Ideación Suicida', { align: 'left', indent: 20 })
            .moveDown(0.7);

        doc.font('Times-Roman').fontSize(12).fillColor('black');

        renderSubSectionTitle(doc, 'Preguntas Primarias: Existencia de Riesgo');
        
        renderField(doc, 'Deseo de Muerte', assessment.deathWish);
        renderField(doc, 'Ideación Activa No Específica', assessment.nonSpecificActiveSuicidalThoughts);

        // Solo mostrar si la ideación activa no específica es SI
        if (assessment.nonSpecificActiveSuicidalThoughts.present === true) {
            renderSubSectionTitle(doc, 'Preguntas Secundarias: Grado de Especificidad');
            
            renderField(doc, 'Ideación Activa Con Métodos', assessment.activeSuicidalIdeationWithMethods);
            renderField(doc, 'Ideación Activa Con Intención', assessment.activeSuicidalIdeationWithIntent);
            
            // Caso especial para Ideación con Plan (aplicando el nuevo resaltado)
            const planField = assessment.activeSuicidalIdeationWithPlan;
            if (planField) {
                // 1. Título de la pregunta (Ahora en negrita y un poco más grande: 13pt)
                doc.font('Helvetica-Bold')
                   .fontSize(13)
                   .fillColor('black')
                   .text('• Ideación Activa Con Plan (Específico): ', { indent: 50, continued: true });
                
                // 2. Respuesta (Resaltada en negrita y el nuevo color de énfasis más suave)
                doc.font('Helvetica-Bold')
                   .fillColor(highlightColor)
                   .text(formatBool(planField.present), { continued: true });
                
                // Volver al tamaño de fuente estándar (12pt)
                doc.fontSize(12);

                let planDetails = [];
                // Se cambia 'Detalle del Plan' por 'Descripción del Plan'
                if (planField.description) { planDetails.push(`Descripción del Plan: ${planField.description}`); }
                if (planField.frequency !== undefined && planField.frequency > 0) { planDetails.push(`Frecuencia (Plan): ${planField.frequency}`); }
                
                if (planDetails.length > 0) {
                     // 3. Detalles (Resaltados y entre paréntesis)
                    doc.text(' (', { continued: true, font: 'Times-Roman', fillColor: 'black' });
        
                    planDetails.forEach((d, index) => {
                        const parts = d.split(':');
                        if (parts.length > 1) {
                            // Etiqueta en Negrita
                            doc.font('Helvetica-Bold').fillColor('black').text(parts[0], { continued: true, baseline: 'sub' });
                            doc.font('Times-Roman').fillColor('black').text(': ', { continued: true, baseline: 'sub' });
                            // Valor en Azul Suave
                            doc.font('Helvetica-Bold').fillColor(highlightColor).text(parts.slice(1).join(':').trim(), { continued: true, baseline: 'sub' });
                        } else {
                            doc.font('Helvetica-Bold').fillColor(highlightColor).text(d, { continued: true, baseline: 'sub' });
                        }
                        if (index < planDetails.length - 1) {
                           doc.font('Times-Roman').fillColor('black').text(' | ', { continued: true, baseline: 'sub' });
                        }
                   });

                   doc.font('Times-Roman').fillColor('black').text(')', { continued: false });

                } else {
                    doc.text('');
                }
                doc.moveDown(0.2);
            }
        }
        
        doc.moveDown(1);
        
        // --- Sección 2: Intensidad de la Ideación ---
        doc.fillColor(primaryColor)
            .fontSize(18) // Título de sección (18pt)
            .font('Helvetica-Bold')
            .text('2. Intensidad y Riesgo de Ideación', { align: 'left', indent: 20 })
            .moveDown(0.7);

        doc.font('Times-Roman').fontSize(12).fillColor('black');
        
        // TIPO DE IDEACIÓN MÁS SERIA
        const mostSeriousType = assessment.ideationIntensity?.mostSeriousIdeationType || 'N/A';
        const mostSeriousDesc = assessment.ideationIntensity?.mostSeriousIdeationDescription || 'Ninguna';
        const frequencyLabel = assessment.ideationIntensity?.frequencyLabel || 'N/A';
        const ideationRisk = assessment.ideationRiskLevel || 'N/A';

        // Aplicando formato estandarizado para estas variables (Etiqueta en Normal, Valor en Azul Suave)
        doc.font('Helvetica-Bold').fontSize(13).fillColor('black').text('• Tipo de Ideación Más Seria (Escala 1-5): ', { indent: 50, continued: true });
        doc.font('Helvetica-Bold').fillColor(highlightColor).text(mostSeriousType).fontSize(12).fillColor('black');
        
        doc.font('Helvetica-Bold').fontSize(13).fillColor('black').text('• Detalle de la Ideación Reportada: ', { indent: 50, continued: true });
        doc.font('Helvetica-Bold').fillColor(highlightColor).text(mostSeriousDesc).fontSize(12).fillColor('black');

        doc.font('Helvetica-Bold').fontSize(13).fillColor('black').text('• Frecuencia de la Ideación: ', { indent: 50, continued: true });
        doc.font('Helvetica-Bold').fillColor(highlightColor).text(frequencyLabel).fontSize(12).fillColor('black');

        doc.moveDown(0.5);

        // Resumen de Riesgo (Estandarizado en 14pt)
        doc.fillColor(accentColor).font('Helvetica-Bold').fontSize(14);
        doc.text(`Nivel de Riesgo por Componente de Ideación: ${ideationRisk}`, { indent: 50 });
        doc.fillColor('black').font('Times-Roman').fontSize(12);
        doc.moveDown(1);
        
        // --- Sección 3: Comportamiento Suicida ---
        doc.fillColor(primaryColor)
            .fontSize(18) // Título de sección (18pt)
            .font('Helvetica-Bold')
            .text('3. Historial de Comportamiento Suicida', { align: 'left', indent: 20 })
            .moveDown(0.7);
        
        doc.font('Times-Roman').fontSize(12).fillColor('black');

        renderSubSectionTitle(doc, 'Registro de Actos Recientes o Pasados:');
        
        renderField(doc, 'Intento de Suicidio Consumado (Actual o Pasado)', assessment.actualAttempt);
        renderField(doc, 'Intento Interrumpido (Por Factor Externo)', assessment.interruptedAttempt);
        renderField(doc, 'Intento Abortado (Por el Propio Individuo)', assessment.abortedAttempt);
        renderField(doc, 'Actos Preparatorios o No Lesivos', assessment.preparatoryActs);

        doc.moveDown(0.5);

        renderSubSectionTitle(doc, 'Análisis de Letalidad:');
        
        // Completed Suicide (Aplicando nuevo formato)
        doc.font('Helvetica-Bold').fontSize(13).fillColor('black').text('• Suicidio Consumado (Historial): ', { indent: 50, continued: true });
        doc.font('Helvetica-Bold').fillColor(highlightColor).text(formatBool(assessment.completedSuicide)).fontSize(12).fillColor('black');
        
        // Most Lethal Attempt (Aplicando nuevo formato)
        const lethalDate = assessment.mostLethalAttemptDate 
            ? new Date(assessment.mostLethalAttemptDate).toLocaleDateString('es-ES') 
            : 'N/A';
        doc.font('Helvetica-Bold').fontSize(13).fillColor('black').text('• Fecha del Intento Histórico Más Letal: ', { indent: 50, continued: true });
        doc.font('Helvetica-Bold').fillColor(highlightColor).text(lethalDate).fontSize(12).fillColor('black');

        // Lethality Degree (Aplicando nuevo formato)
        doc.font('Helvetica-Bold').fontSize(13).fillColor('black').text('• Grado de Letalidad (Escala 0-5): ', { indent: 50, continued: true });
        doc.font('Helvetica-Bold').fillColor(highlightColor).text(assessment.lethalityDegree?.toString() ?? 'N/A').fontSize(12).fillColor('black');

        doc.moveDown(0.5);

        // Resumen de Riesgo (Estandarizado en 14pt)
        doc.fillColor(accentColor).font('Helvetica-Bold').fontSize(14);
        doc.text(`Nivel de Riesgo por Componente de Comportamiento: ${assessment.behaviorRiskLevel}`, { indent: 50 });
        doc.fillColor('black').font('Times-Roman').fontSize(12);

        doc.moveDown(1);
        
        // --- Observaciones Finales ---
        doc.fillColor(primaryColor)
            .fontSize(18) // Título de sección (18pt)
            .font('Helvetica-Bold')
            .text('4. Conclusiones y Observaciones Finales del Evaluador', { align: 'left', indent: 20 })
            .moveDown(0.7);
        
        doc.font('Times-Roman').fontSize(12).fillColor('black');
        doc.text(assessment.finalRemarks || 'No se registraron observaciones finales específicas.', { 
            align: 'justify', 
            indent: 50, 
            paragraphGap: 10 
        });

        doc.moveDown(2);
        
        // Pie de página
        doc.fontSize(10)
            .fillColor('#666')
            .text(`Reporte generado el ${new Date().toLocaleDateString('es-ES')} por el sistema de gestión.`, 
                50, 
                doc.page.height - 50, 
                { align: 'center', width: doc.page.width - 100 });
        
        doc.end();

    } catch (error) {
        console.error('Error al generar el PDF de la evaluación:', error);
        res.status(500).send('Error al generar el PDF de la evaluación');
    }
};

module.exports = {
    generateAssessmentReportPDF,
};