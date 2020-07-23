<template>
  <div>
    <div class="form-group" v-if="!hide_url_sheet">
      <label for="exampleInputEmail1">URL GGSheet</label>
      <input
        type="text"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="URL GGSheet"
        v-model="url_sheet"
      />
      <span>
        <button class="btn btn-primary" @click="btn_check">Kiểm tra</button>
      </span>
    </div>
    <button class="btn btn-primary" v-if="hide_url_sheet">Đổi URL Sheet</button>
    <div class="form-group">
      <label for="exampleInputEmail1">Họ Tên</label>
      <input
        type="text"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Họ Tên"
        v-model="order.name"
      />
    </div>
    <div class="form-group">
      <label for="exampleInputEmail1">Số điện thoại</label>
      <input
        type="text"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Số điện thoại"
        v-model="order.phone"
      />
    </div>
    <div class="form-group">
      <label for="exampleInputEmail1">Địa chỉ</label>
      <input
        type="text"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Địa chỉ"
        v-model="order.address"
      />
    </div>
    <div class="form-group">
      <label for="exampleInputEmail1">Thông tin sản phẩm</label>
      <input
        type="text"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Thông tin sản phẩm"
        v-model="order.cart"
      />
    </div>
    <div class="form-group">
      <label for="exampleInputEmail1">Ghi Chú</label>
      <input
        type="text"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Ghi chú"
        v-model="order.note"
      />
    </div>
    <!-- <Demo /> -->
    <button class="btn btn-primary" @click="btn_Save">Lưu</button>
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
      order: {
        name: "",
        phone: "",
        address: "",
        cart: "",
        note: "",
      },
      entry: [],
      hide_url_sheet: false,
    };
  },
  async mounted() {},
  methods: {
    btn_changeURL(){
      this.hide_url_sheet=false
    },
    async btn_check() {
      try {
        console.log("test run");
        let body = {
          url_sheet: this.url_sheet,
        };
        let res = await fetch.post(API, body);
        //  console.log("res data form", res.data.data.body);

        // detect entry from response
        let arr = res.data.data.body.split("data-params=");
        console.log("split arr", arr);
        arr.shift();
        console.log("split arr", arr);
        let entry = [];
        for (let i = 0; i < arr.length; i++) {
          let e = arr[i].split(",[[")[1].split(",")[0];
          entry.push(e);
        }
        ////
        console.log("text arr", entry);
        this.entry = entry;
        if (!entry.length) return this.swalToast("URL sai", "error");
        this.hide_url_sheet = true;
        this.swalToast("Thành công", "success");
      } catch (e) {
        this.swalToast("URL lỗi", "error");
        console.log("e", e);
      }
    },
    async btn_Save() {
      console.log(" this.entry", this.entry);
      let body = {};
      body[`entry.${this.entry[0]}`] = this.order.name;
      body[`entry.${this.entry[1]}`] = this.order.phone;
      body[`entry.${this.entry[2]}`] = this.order.address;
      body[`entry.${this.entry[3]}`] = this.order.cart;
      body[`entry.${this.entry[4]}`] = this.order.note;
      console.log("body", body);
      // let add_data_sheet = await fetch.post(API, body);

      $.ajax({
        method: "POST",
        url: this.url_sheet,
        data: body,
        error: (e) => {
          this.swalToast("Tạo đơn thành công", "success");
        },
      });
      console.log("add_data_sheet", add_data_sheet);
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
</style>