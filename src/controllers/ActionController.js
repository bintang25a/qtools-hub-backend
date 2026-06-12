import puppeteer from "puppeteer";
import { Asset, Transaction } from "../database/models/Model.js";

export const assetReturn = async (req, res) => {
  const { transaction_id } = req?.params;

  if (!transaction_id) {
    return res.status(400).json({
      success: false,
      message: "Update transaction failed, Params cannot empty",
    });
  }

  const { returnAt } = req?.body;

  const transaction = await Transaction.findByPk(transaction_id, {});

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Update transaction failed, Transaction not found",
    });
  }

  if (!returnAt) {
    return res.status(400).json({
      success: false,
      message: "Update transaction failed, Field cannot empty",
    });
  }

  const asset = await Asset.findByPk(transaction.asset_id, {});

  if (!asset) {
    return res.status(400).json({
      success: false,
      message: "Create transaction failed, Asset not found",
    });
  }

  try {
    await asset.update({
      status: "AV",
    });

    await transaction.update({
      returnAt,
    });

    res.status(200).json({
      success: true,
      message: "Update transaction successfully",
      data: transaction,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Update transaction failed",
    });
  }
};

export const pdfDownload = async (req, res) => {
  try {
    const { html } = req.body;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
      },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="BAKK.pdf"',
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed generate PDF",
    });
  }
};
