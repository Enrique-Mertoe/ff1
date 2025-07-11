import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-license',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.css']
})
export class PermitComponent {
  // Permit data
  permitData = {
    permitNumber: 'NWRA/BDL117/2024',
    companyName: 'Geo-Tech Solutions',
    companyAddress: 'P/Bag 24207, Lilongwe',
    issueDate: '12th November 2024',
    expiryDate: '11th November 2025',
    directorName: 'Dwight Kambuku PhD',
    contactPhone: '+265 (0) 995 511 963',
    contactEmail: 'ceo@nwra.mw'
  };

  // QR Code data
  qrData = `NWRA BOREHOLE PERMIT
Number: ${this.permitData.permitNumber}
Holder: ${this.permitData.companyName}
Valid: ${this.permitData.issueDate} to ${this.permitData.expiryDate}`;

  conditions = [
    'Backfill dry boreholes when encountered',
    'Compile and submit all drilling data to NWRA',
    'Adhere to standard borehole specifications',
    'Report unusual hydrogeological findings',
    'Only drill for clients with valid abstraction permits'
  ];

  async generatePDF() {
    const element = document.getElementById('permit-content');
    const button = document.querySelector('button');

    if (button) button.style.display = 'none';

    // Create watermark canvas
    const watermark = await this.createWatermark();

    html2canvas(element!, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait mode
      const imgProps = pdf.getImageProperties(canvas);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add watermark first
      pdf.addImage(watermark, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      // Add main content
      pdf.addImage(canvas, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      pdf.save(`Borehole_Permit_${this.permitData.permitNumber}.pdf`);

      if (button) button.style.display = 'block';
    });
  }

  private createWatermark(): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d')!;

      // Create watermark image
      const img = new Image();
      img.src = '/logo_docs.png'; // Your logo path
      img.onload = () => {
        ctx.globalAlpha = 0.1; // 10% opacity
        ctx.drawImage(img, 100, 200, 400, 400); // Centered watermark
        resolve(canvas.toDataURL('image/png'));
      };

      // Fallback if image fails to load
      img.onerror = () => {
        ctx.globalAlpha = 0.1;
        ctx.font = '48px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText('NWRA', 200, 400);
        resolve(canvas.toDataURL('image/png'));
      };
    });
  }
}
