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
