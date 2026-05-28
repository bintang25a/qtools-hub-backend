import { Asset } from "../database/models/Model.js";

export const index = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (filters["all"] == "true") {
      const assets = await Asset.findAll();

      return res.status(200).json({
        success: true,
        message: "Display all assets successfully",
        data: assets,
      });
    }

    const whereClause = {};
    const allowedFilters = [
      "asset_number",
      "class",
      "status",
      "location",
      "creator",
    ];

    allowedFilters.forEach((key) => {
      if (filters[key]) {
        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
      }
    });

    const { count, rows } = await Asset.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Display all assets successfully",
      total_page: totalPages,
      current_page: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display all assets failed",
    });
  }
};

export const show = async (req, res) => {
  const { asset_number } = req?.params;

  if (!asset_number) {
    return res.status(400).json({
      success: false,
      message: "Display asset failed, Params cannot empty",
    });
  }

  try {
    const asset = await Asset.findByPk(asset_number, {});

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Display asset failed, Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Display asset successfully",
      data: asset,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display asset failed",
    });
  }
};

export const store = async (req, res) => {
  const {
    asset_number,
    class: classAsset,
    description,
    status,
    location,
    creator,
  } = req?.body;

  const isEmpty =
    !asset_number ||
    !classAsset ||
    !description ||
    !status ||
    !location ||
    !creator;

  if (isEmpty) {
    return res.status(400).json({
      success: false,
      message: "Create asset failed, Field cannot empty",
    });
  }

  const asset = await Asset.findByPk(asset_number, {});

  if (asset) {
    return res.status(400).json({
      success: false,
      message: "Create asset failed, Asset already exist",
    });
  }

  try {
    const asset = await Asset.create({
      asset_number,
      class: classAsset,
      description,
      status,
      location,
      creator,
    });

    res.status(201).json({
      success: true,
      message: "Create asset successfully",
      data: asset,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Create asset failed",
    });
  }
};

export const update = async (req, res) => {
  const { asset_number } = req?.params;

  if (!asset_number) {
    return res.status(400).json({
      success: false,
      message: "Update asset failed, Params cannot empty",
    });
  }

  const {
    class: classAsset,
    description,
    status,
    location,
    creator,
  } = req?.body;

  const asset = await Asset.findByPk(asset_number, {});

  if (!asset) {
    return res.status(404).json({
      success: false,
      message: "Update asset failed, Asset not found",
    });
  }

  const isEmpty =
    !classAsset || !description || !status || !location || !creator;

  if (isEmpty) {
    return res.status(400).json({
      success: true,
      message: "Update asset failed, Field cannot empty",
    });
  }

  try {
    await asset.update({
      class: classAsset,
      description,
      status,
      location,
      creator,
    });

    res.status(200).json({
      success: true,
      message: "Update asset successfully",
      data: asset,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Update asset failed",
    });
  }
};

export const destroy = async (req, res) => {
  const { asset_number } = req?.params;

  if (!asset_number) {
    return res.status(400).json({
      success: false,
      message: "Delete asset failed, Params cannot empty",
    });
  }

  const asset = await Asset.findByPk(asset_number, {});

  if (!asset) {
    return res.status(404).json({
      success: false,
      message: "Delete asset failed, Asset not found",
    });
  }

  try {
    await Asset.destroy({
      where: {
        asset_number,
      },
    });

    res.status(200).json({
      success: true,
      message: "Delete asset successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Delete asset failed",
    });
  }
};
