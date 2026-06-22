package com.healthcare.service;

import java.io.ByteArrayOutputStream;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;



@Service
public class PrescriptionPdfService {

    public byte[]
    generatePrescription(

            String patientName,

            String doctorName,

            String diagnosis,

            String medicines,

            String notes

    ) {

        try {

            Document document =
                    new Document();


            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();



            PdfWriter.getInstance(

                    document,

                    outputStream

            );



            document.open();



            document.add(

                    new Paragraph(
                            "CarePlus Prescription"
                    )

            );


            document.add(

                    new Paragraph(
                            " "
                    )

            );


            document.add(

                    new Paragraph(
                            "Patient: "
                                    + patientName
                    )

            );


            document.add(

                    new Paragraph(
                            "Doctor: "
                                    + doctorName
                    )

            );


            document.add(

                    new Paragraph(
                            "Diagnosis: "
                                    + diagnosis
                    )

            );


            document.add(

                    new Paragraph(
                            "Medicines: "
                                    + medicines
                    )

            );


            document.add(

                    new Paragraph(
                            "Notes: "
                                    + notes
                    )

            );



            document.close();



            return outputStream
                    .toByteArray();

        }

        catch (
                Exception error
        ) {

            throw new RuntimeException(
                    error
            );

        }

    }

    public byte[] generatePrescription(
            String patientName,
            String doctorName,
            String notes
    ) {
        return generatePrescription(patientName, doctorName, "N/A", notes, notes);
    }

}
