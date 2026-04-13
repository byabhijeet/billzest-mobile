# PDF Generation Setup Guide

## Overview
The invoice PDF generation feature has been implemented with fallback support. When PDF libraries are installed, invoices will be generated as actual PDF files. Otherwise, the system falls back to HTML/text sharing.

## Installation

### Required Packages
Install the following packages for full PDF functionality:

```bash
npm install react-native-html-to-pdf react-native-share react-native-fs
```

### iOS Setup
After installing packages, run:
```bash
cd ios && pod install && cd ..
```

### Android Setup
No additional setup required for Android. The libraries work out of the box.

## Features

### PDF Generation
- Converts HTML invoices to PDF files
- Saves PDFs to device storage
- Supports sharing via native share sheet
- Falls back to text sharing if libraries not installed

### Download Functionality
- Android: Saves PDFs to Downloads folder
- iOS: Saves PDFs to Documents directory (accessible via Share)

### Share Functionality
- Uses `react-native-share` for file sharing when available
- Falls back to native Share API with text when libraries not installed
- Supports sharing to WhatsApp, Email, etc.

## Usage

The PDF service automatically detects if libraries are installed:

```typescript
// Generate PDF (returns file path or HTML string)
const filePath = await pdfService.generateInvoicePDF(invoice);

// Share as PDF (with fallback)
await pdfService.shareInvoiceAsPDF(invoice);
```

## Fallback Behavior

If PDF libraries are not installed:
- `generateInvoicePDF()` returns HTML string
- `shareInvoiceAsPDF()` shares formatted text
- User sees informative messages about PDF library installation

## Testing

1. **With Libraries Installed:**
   - Share button should open native share sheet with PDF file
   - Download button should save PDF to device
   - PDF should be properly formatted

2. **Without Libraries:**
   - Share button should share formatted text
   - Download button should show installation message
   - All functionality should work gracefully

## Troubleshooting

### PDF Not Generating
- Check if libraries are installed: `npm list react-native-html-to-pdf`
- For iOS, ensure pods are installed: `cd ios && pod install`
- Check device permissions for file system access

### Share Not Working
- Ensure `react-native-share` is installed
- Check if native share sheet is available on device
- Verify file path is correct (check logs in dev mode)

### File Not Found Errors
- Ensure `react-native-fs` is properly installed
- Check file system permissions on device
- Verify file path format (different for iOS/Android)

