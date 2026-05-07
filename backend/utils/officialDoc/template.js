export const officialDocTemplate = ({
    requestNumber,
    subject,
    fullName,
    dateOfBirth,
    address,
    issuedDate,
    mayorName,
    logoBase64,
    stampBase64
}) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />

    <style>
        body {
            font-family: "Times New Roman", serif;
            padding: 60px;
            color: #111;
        }

        /* HEADER */
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .logo {
            width: 120px;
            height: auto;
        }

        .header-center {
            text-align: center;
            flex: 1;
        }

        .header-center h1 {
            font-size: 22px;
            margin: 0;
            font-weight: bold;
        }

        .header-center h2 {
            font-size: 18px;
            margin: 5px 0;
            font-weight: normal;
        }

        .header-center h3 {
            font-size: 16px;
            margin-top: 5px;
        }

        /* SUBJECT */
        .subject {
            margin-top: 40px;
            font-weight: bold;
            font-size: 18px;
        }

        /* BODY */
        .content {
            margin-top: 30px;
            font-size: 16px;
            line-height: 1.8;
        }

        /* FOOTER */
        .footer {
            margin-top: 80px;
        }

        .signature {
            margin-top: 60px;
        }

        .stamp {
            width: 140px;
            margin-top: 20px;
        }

        .signature-line {
            margin-top: 40px;
        }

        .muted {
            color: #444;
        }
    </style>
</head>

<body>

    <!-- TOP SECTION -->
    <div class="top-bar">

        <!-- LOGO -->
        <div>
            <img src="data:image/png;base64,${logoBase64}" class="logo" />
        </div>

        <!-- CENTER TITLE -->
        <div class="header-center">
            <h1>Republic of Lebanon</h1>
            <h2>Ministry of Interior and Municipalities</h2>
            <h3>UL Municipality</h3>
        </div>

        <div style="width:120px;"></div>

    </div>

    <!-- SUBJECT -->
    <div class="subject">
        Subject: ${subject}
    </div>

    <!-- BODY -->
    <div class="content">

        <p>
            The UL Municipality certifies that
            <strong>${fullName}</strong>,
            born on <strong>${dateOfBirth}</strong>,
            currently residing at <strong>${address}</strong>,
            is officially registered within our municipality records.
        </p>

        <p>
            This document is issued based on request
            <strong>${requestNumber}</strong>.
        </p>

        <p>
            This certification is provided for administrative and official use
            in accordance with municipal regulations and procedures.
        </p>

        <p>
            Issued on: <strong>${issuedDate}</strong>
        </p>

    </div>

    <!-- FOOTER -->
    <div class="footer">

        <div class="signature">
            <p class="muted">Signed by:</p>
            <strong>${mayorName}</strong>

            <div class="signature-line">
                __________________________
            </div>
        </div>

        <img src="data:image/png;base64,${stampBase64}" class="stamp" />

    </div>

</body>
</html>
    `;
};