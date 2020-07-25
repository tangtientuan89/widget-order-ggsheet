<template>
  <div>
    <div v-if="!hide_url_sheet">
      <label for="url-sheet" class="pt-3 pb-1">URL GGSheet</label>
      <div
        id="url-sheet"
        class="input url-sheet"
        contenteditable="plaintext-only"
        data-text="Nhập URL GG-Sheet"
      ></div>
    </div>
    <div class="pb-2 text-right">
      <button
        class="btn btn-primary mx-1"
        v-if="!hide_url_sheet&&!hide_btn_cancel"
        @click="btn_cancel"
      >Huỷ Bỏ</button>
      <button class="btn btn-primary" v-if="!hide_url_sheet" @click="btn_check">Xác nhận</button>
      <div v-else class="exchange-url d-flex justify-content-end align-items-center text-primary">
        <i id="icon-exchange" class="fas fa-exchange-alt" style="font-size:1rem"></i>
        <label for="icon-exchange" class="px-1" @click="btn_changeURL">Thay đổi URL</label>
      </div>
    </div>
    <div v-if="!hide_form_order" class>
      <label for="name">Họ Tên</label>
      <div class="input name" contenteditable="plaintext-only" data-text="FullName"></div>
      <label for="phone">Số Điện Thoại</label>
      <div class="input phone" contenteditable="plaintext-only" data-text="Phone"></div>
      <label for="address">Địa Chỉ</label>
      <div class="input address" contenteditable="plaintext-only" data-text="Address"></div>
      <label for="product">Sản Phẩm</label>
      <div class="input product" contenteditable="plaintext-only" data-text="Products"></div>
      <label>Tổng Giá Đơn</label>
      <div class="input total_price" contenteditable="plaintext-only" data-text="Total Price"></div>
      <label for="note">Ghi Chú</label>
      <div class="input note" contenteditable="plaintext-only" data-text="Note"></div>
      <!-- <Demo /> -->
      <div class="text-right mb-2">
        <button class="btn btn-primary mx-1" @click="refresh_input">Làm mới</button>
        <button class="btn btn-primary" @click="btn_Save">Lưu lại</button>
      </div>
    </div>
  </div>
</template>

<script>
// import Demo from "@/components/Demo";
import fetch from "@/services/resful.js";
const API = "http://localhost:3000/test";
export default {
  // components: {
  //   Demo: Demo,
  // },
  data() {
    return {
      url_sheet: "",
      entry: [],
      hide_btn_cancel: true,
      hide_url_sheet: false,
      hide_form_order: true,
      handle_api: true,
    };
  },
  mounted() {
    // this.url_sheet = localStorage.storage_widget_order_ggsheet_url;
    // this.entry = localStorage.storage_widget_order_ggsheet_entry;
    this.url_sheet = JSON.parse(
      localStorage.getItem("widget_order_ggsheet_url")
    );
    this.entry = JSON.parse(localStorage.getItem("widget_order_ggsheet_entry"));
    console.log("this.entry localStorage", this.entry);
    if (this.url_sheet && this.entry.length) {
      this.hide_form_order = false;
      this.hide_url_sheet = true;
    }
  },
  methods: {
    btn_changeURL() {
      this.hide_btn_cancel = false;
      this.hide_url_sheet = false;
      this.hide_form_order = true;
    },
    btn_cancel() {
      this.hide_btn_cancel = true;
      this.hide_form_order = false;
      this.hide_url_sheet = true;
    },

    async btn_check() {
      try {
        let url_sheet = this.check_url($("#url-sheet").html());
        if (!url_sheet) return;
        if (!this.handle_api) return;
        this.handle_api = false;
        Swal.showLoading();
        let res = await fetch.post(API, { url_sheet: url_sheet });
        // console.log("res data form", res.data.data.body);
        console.log("res", res);
        Swal.hideLoading();
        let html = res.data.data.body;
        let entry = this.detectHTML(html); // detect entry from response
        if (!entry.length) return this.swalToast("URL sai", "error");
        localStorage.setItem(
          "widget_order_ggsheet_url",
          JSON.stringify(url_sheet)
        );
        localStorage.setItem(
          "widget_order_ggsheet_entry",
          JSON.stringify(entry)
        );
        // localStorage.storage_widget_order_ggsheet_url = url_sheet;
        // localStorage.storage_widget_order_ggsheet_entry = entry;
        $("#url-sheet").html("");
        this.url_sheet = url_sheet;
        this.hide_url_sheet = true;
        this.hide_form_order = false;
        this.handle_api = true;
        this.swalToast("Thành công", "success");
      } catch (e) {
        this.handle_api = true;
        this.swalToast("URL lỗi", "error");
        Swal.hideLoading();
        console.log("e", e);
      }
    },
    detectHTML(html) {
      let arr = html.split("data-params=");
      console.log("split arr", arr);
      arr.shift();
      console.log("split arr", arr);
      let entry = [];
      for (let i = 0; i < arr.length; i++) {
        let e = arr[i].split(",[[")[1].split(",")[0];
        entry.push(e);
      }
      console.log("text arr", entry);
      this.entry = entry;
      return entry;
    },

    check_url(url) {
      let search_in_url = url.search("docs.google.com");
      console.log("search_in_url", search_in_url);
      if (search_in_url == -1) {
        this.swalToast("URL sai", "error");
        return false;
      }
      let arr = url.split("/");
      let id_ggsheet = "";
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > id_ggsheet.length) id_ggsheet = arr[i];
      }
      console.log("id_ggsheet", id_ggsheet);
      return `https://docs.google.com/forms/d/e/${id_ggsheet}/formResponse`;
    },

    async btn_Save() {
      console.log(" this.entry", this.entry);
      if (!this.validate_order()) return;
      let body = {};
      body[`entry.${this.entry[0]}`] = $(".name").html();
      body[`entry.${this.entry[1]}`] = $(".phone").html();
      body[`entry.${this.entry[2]}`] = $(".address").html();
      body[`entry.${this.entry[3]}`] = $(".product").html();
      body[`entry.${this.entry[4]}`] = $(".total_price").html();
      body[`entry.${this.entry[5]}`] = $(".note").html();
      console.log("body", body);
      // let add_data_sheet = await fetch.post(API, body);
      console.log("url", this.url_sheet);
      $.ajax({
        method: "POST",
        url: this.url_sheet,
        data: body,
        success: (r) => {
          console.log("r", r);
        },
        error: (e) => {
          console.log(e);
          this.swalToast("Tạo đơn thành công", "success");
        },
      });
    },
    refresh_input() {
      $(".name").html("");
      $(".phone").html("");
      $(".address").html("");
      $(".product").html("");
      $(".total_price").html("");
      $(".note").html("");
      $(".name").focus();
    },
    validate_order() {
      console.log("1111111111", $(".name").html().trim());
      if ($(".name").html().trim() == "") {
        return this.swalToast("Bạn chưa nhập Họ Tên", "warning");
      }
      if ($(".phone").html().trim() == "") {
        return this.swalToast("Bạn chưa nhập Số ĐT", "warning");
      }
      if ($(".address").html().trim() == "") {
        return this.swalToast("Bạn chưa nhập Địa Chỉ", "warning");
      }
      if ($(".product").html().trim() == "") {
        return this.swalToast("Bạn chưa nhập Tổng Giá Đơn", "warning");
      }
      console.log("check num", /^\d*$/.test($(".total_price").html().trim()));
      console.log(
        "format num",
        this.format_number($(".total_price").html().trim())
      );
      if ($(".total_price").html().trim() == "") {
        return this.swalToast("Bạn chưa nhập Tổng giá đơn", "warning");
      }
      if (!/^\d*$/.test($(".total_price").html().trim())) {
        return this.swalToast("Tổng Giá Đơn phải là số", "warning");
      }
      return true;
    },
    format_number(number) {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "VND",
      }).format(number);
    },
    swalToast(title, icon) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: false,
        onOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: icon,
        title: title,
        padding: "5px",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$fontSize: 13px;
@mixin divNote {
  -moz-appearance: textfield;
  -webkit-appearance: textfield;
  font: -moz-field;
  font: -webkit-small-control;
  word-wrap: break-word;
  outline: none;
}
@mixin divEditTable {
  @include divNote;
  width: 100%;
  padding: 5px;
  overflow-y: scroll;
  background-color: -moz-field;
  line-height: 16px;
  border-radius: 6px;
  font-size: $fontSize;
}
* {
  font-size: $fontSize;
  line-height: 16px;
  box-sizing: border-box;
  ::-webkit-scrollbar {
    width: 0px;
    background-color: rgb(225, 225, 225);
  }
}
.input {
  max-height: 80px;
  color: #495057;
  border: 1px solid rgba(114, 114, 114, 0.5);
  border-color: rgba(114, 114, 114, 0.3);
  border-radius: 5px;
  margin-bottom: 0.5rem;
  // background-color: rgb(225, 225, 225);
  @include divEditTable;
  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
}
[contentEditable="plaintext-only"]:empty:not(:focus):before {
  content: attr(data-text);
  color: rgba(5, 5, 5, 0.5);
  pointer-events: none;
  display: block;
  margin-left: 5px;
}
.exchange-url {
  padding-top: 0.8rem;
  &:hover {
    cursor: pointer;
  }
  label {
    margin: 0;
    &:hover {
      cursor: pointer;
    }
  }
}
label {
  margin-bottom: 0.3rem;
  margin-left: 0.2rem;
}
button {
  width: 4rem;
  padding-left: 0;
  padding-right: 0;
}
</style>