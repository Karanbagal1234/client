import { useEffect, useId, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

const QRScanner = ({
  onScanSuccess,
  onScanFailure,
  fps = 10,
  qrbox = { width: 250, height: 250 },
  supportedScanTypes = [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
  rememberLastUsedCamera = true,
  verbose = false,
  className = "",
  scanLabel = "Position QR code within the frame...",
}) => {
  const scannerElementId = useId();
  const [scanState, setScanState] = useState("idle");
  const scannerRef = useRef(null);

  // Adjust qrbox dynamically for mobile
  const getQrBox = () => {
    return {
      width: window.innerWidth < 768 ? window.innerWidth - 40 : 250,
      height: window.innerWidth < 768 ? window.innerWidth - 40 : 250,
    };
  };

  useEffect(() => {
    const initScanner = () => {
      if (scannerRef.current) return;

      const scanner = new Html5QrcodeScanner(
        scannerElementId,
        {
          fps,
          qrbox: getQrBox(),
          rememberLastUsedCamera,
          supportedScanTypes,
        },
        verbose
      );

      scanner.render(
        (decodedText) => {
          setScanState("success");

          try {
            const parsedData = JSON.parse(decodedText);

            if (parsedData?.type && parsedData?.ID) {
              onScanSuccess(parsedData);
            } else {
              throw new Error("Invalid QR format");
            }
          } catch (e) {
            console.error("QR Parse Error:", e);
            onScanFailure("Invalid QR Code");
          }

          scanner.clear().catch(console.error);
        },
        (error) => {
          setScanState("error");
          console.error("QR Scan Error:", error);
          onScanFailure(error);
        }
      );

      scannerRef.current = scanner;
      setScanState("scanning");
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [scannerElementId]);

  const getStatusMessage = () => {
    switch (scanState) {
      case "scanning":
        return scanLabel;
      case "success":
        return "Scan successful!";
      case "error":
        return "Scan failed, please try again.";
      default:
        return "";
    }
  };

  return (
    <div
      className={`qr-scanner w-full max-w-sm mx-auto p-4 rounded-lg shadow-lg bg-white ${className}`}
    >
      <div
        id={scannerElementId}
        className="scanner-viewport relative w-full h-[300px] sm:h-[400px] rounded-lg border border-gray-300"
      />
      <div
        className={`status-message ${scanState} mt-2 text-center text-sm text-gray-700`}
      >
        {getStatusMessage()} 
       
      </div>
    </div>
  );
};

export default QRScanner;