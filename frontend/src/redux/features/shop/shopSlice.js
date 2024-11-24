import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  products: [],
  checked: [],
  radio: [],
  brandCheckboxes: {},
  checkedBrands: [],
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setRadio: (state, action) => {
      state.radio = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
} = shopSlice.actions;

export default shopSlice.reducer;

// đoạn mã này sử dụng Redux Toolkit để tạo một slice quản lý trạng thái cho cửa hàng (shop).
//  Slice này giúp bạn quản lý và cập nhật các dữ liệu liên quan đến cửa hàng,
//  chẳng hạn như danh mục sản phẩm, danh sách sản phẩm, các bộ lọc (checkbox, radio),
//  và các thương hiệu sản phẩm đã chọn
