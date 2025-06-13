import { createSlice } from "@reduxjs/toolkit";

const UISlice = createSlice({
  name: "UISlice",
  initialState: {
    //isModalTrashopen: false,
    ispopupinfoopen: false,
    popupinfo: "",
    popupinfoposition: {
      x: 0,
      y: 0,
    },
    showImageSelected: "",
    showMediaLibraryModal: false, // Added to control media library modal visibility
    selectedImagefromGalleryModal: "",
  },

  reducers: {
    setIsPopupInfoOpen: (state, action) => {
      state.ispopupinfoopen = action.payload;
    },
    setPopupInfo: (state, action) => {
      state.popupinfo = action.payload;
    },
    setPopupInfoPosition: (state, action) => {
      state.popupinfoposition = action.payload;
    },
    setShowImageSelected: (state, action) => {
      state.showImageSelected = action.payload;
    },
    setShowMediaLibraryModal: (state, action) => {
      state.showMediaLibraryModal = action.payload;
    },
    setSelectedImagefromGalleryModal: (state, action) => {
      state.selectedImagefromGalleryModal = action.payload;
    },
  },
});

export const {
  setIsPopupInfoOpen,
  setPopupInfo,
  setPopupInfoPosition,
  setShowImageSelected,
  setShowMediaLibraryModal,
  setSelectedImagefromGalleryModal,
} = UISlice.actions;

export default UISlice.reducer;
