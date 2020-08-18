<template>
  <div>
    <div>
      <!-- <p class="mb-0 mt-3">Thông tin khách hàng</p> -->
      <div class="form-row">
        <div class="col">
          <input class="form-control" placeholder="Họ Tên" v-model="info.name" />
        </div>
        <div class="col">
          <input class="form-control" placeholder="Số ĐT" v-model="info.phone" />
        </div>
      </div>
      <input class="form-control" placeholder="Địa chỉ chi tiết" v-model="address" />
      <div class="form-row">
        <div class="col">
          <select v-model="country" class="form-control">
            <option selected value>Việt Nam</option>
            <!-- <option >Quốc Gia</option> -->
          </select>
        </div>
        <div class="col">
          <Autocomplete
            :items="list_city"
            :placeholder="'Tỉnh/Tp'"
            @input_data="city=$event"
            :getData="getDistrict"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="col">
          <Autocomplete
            ref="district"
            :items="list_district"
            :placeholder="'Quận/Huyện'"
            @input_data="district=$event"
            :getData="getWard"
          />
        </div>
        <div class="col">
          <Autocomplete
            ref="ward"
            :items="list_ward"
            :placeholder="'Phường/Xã'"
            @input_data="ward=$event"
            :getData="1"
          />
        </div>
      </div>
      <!-- <p class="mb-0 mt-2">Thông tin sản phẩm</p> -->
      <textarea class="form-control" placeholder="Sản Phẩm" v-model="info.product" title="Sản Phẩm"></textarea>
      <p class="mb-0 mt-2">Giá Trị Đơn Hàng</p>
      <input
        id="input"
        class="form-control text-right"
        type="text"
        placeholder="Giá Trị Đơn Hàng"
        title="Giá Trị Đơn Hàng"
        v-model="info.total_price"
        data-type="currency"
        @keyup="checkKeyBoard($event,$event.target.value)"
      />
      <div class="option my-3 d-flex justify-content-end">
        <div class="d-flex align-items-center" @click="handleShowNote">
          <img class="mr-2" src="../assets/note.png" alt="add note" />
          <p class="text-primary m-0">Thêm ghi chú</p>
        </div>
      </div>
      <div v-if="is_show_note">
        <textarea
          class="input input-large note form-control"
          placeholder="Ghi Chú"
          v-model="info.note"
        ></textarea>
      </div>
      <div class="text-right mb-2">
        <button class="btn btn-primary w-100 my-2" @click="handleShowOrderInfo()">Tạo đơn hàng</button>
      </div>
      <OrderInfo
        :is_show_order_info="is_show_order_info"
        :handleCloseOrderInfo="handleCloseOrderInfo"
        :createOrder="createOrder"
        :info="info"
      />
    </div>
  </div>
</template>

<script>
import fetch from "@/services/resful.js";
import OrderInfo from "./OrderInfo";
import Autocomplete from "./Autocomplete.vue";

export default {
  components: {
    OrderInfo,
    Autocomplete,
  },
  props: ["payload"],
  data() {
    return {
      url_ggform: "",
      entry: [],
      info: {
        name: this.payload.to_name,
        phone: this.payload.to_phone,
        address: "",
        product: "",
        total_price: 0,
        total_price_num: 0,
        note: "",
      },
      number: "",
      country: "",
      list_city: "",
      city: "",
      list_district: "",
      district: "",
      list_ward: "",
      ward: "",
      address: "",
      is_show_note: false,
      is_show_order_info: false,
    };
  },
  mounted() {
    this.getCity();
    let data_localStorage = JSON.parse(
      localStorage.getItem("widget_order_ggsheet")
    );
    console.log("widget_order_ggsheet", data_localStorage);
    this.url_ggform = data_localStorage.url_ggform;
    this.entry = data_localStorage.entry;
    if (this.url_ggform && this.entry.length) {
      this.hide_form_order = false;
      this.hide_url_ggform = true;
    }
  },

  methods: {
    async createOrder() {
      console.log(" this.entry", this.entry);
      let body = {};
      body[`entry.${this.entry[0]}`] = this.info.name;
      body[`entry.${this.entry[1]}`] = this.info.phone;
      body[`entry.${this.entry[2]}`] = this.info.address;
      body[`entry.${this.entry[3]}`] = this.info.product;
      body[`entry.${this.entry[4]}`] = this.info.total_price_num;
      body[`entry.${this.entry[5]}`] = this.info.note;
      console.log("body", body);
      // let add_data_sheet = await fetch.post(API, body);
      console.log("url", this.url_ggform);
      $.ajax({
        method: "POST",
        url: this.url_ggform,
        data: body,
        success: (r) => {
          console.log("r", r);
        },
        error: (e) => {
          console.log(e);
          this.handleCloseOrderInfo();
          this.swalToast("Tạo đơn thành công", "success");
        },
      });
    },
    async getCity() {
      try {
        let get_list_city = await fetch.get(
          "https://ext.botup.io/v1/delivery/subvn/thongtin/tinhtp"
        );
        this.list_city = get_list_city.data.data;
        console.log(" this.list_city", this.list_city);
      } catch (e) {
        console.log(e);
      }
    },
    async getDistrict() {
      try {
        console.log("handle getDistrict", this.city);

        let city = "";
        for (let index = 0; index < this.list_city.length; index++) {
          if (this.city == this.list_city[index].name)
            city = this.list_city[index];
        }

        let path = "https://ext.botup.io/v1/delivery/subvn/thongtin/quanhuyen";
        let params = {
          matinh: city.code,
        };
        let get_list_district = await fetch.get(path, params);
        this.list_district = get_list_district.data.data;
        console.log("  this.list_district", this.list_district);
      } catch (error) {
        console.log("error", error);
      }
    },
    async getWard() {
      try {
        console.log("handle getWard", this.district);

        let district = "";
        for (let index = 0; index < this.list_district.length; index++) {
          if (this.district == this.list_district[index].name)
            district = this.list_district[index];
        }

        let path =
          "https://ext.botup.io/v1/delivery/subvn/thongtin/xaphuonghuyen";
        let params = {
          mahuyen: district.code,
        };
        let get_list_ward = await fetch.get(path, params);
        this.list_ward = get_list_ward.data.data;
        console.log(" this.list_ward", this.list_ward);
      } catch (error) {
        console.log("error", error);
      }
    },
    // handleClearInputDistrict() {
    //   console.log("run clear distric", this.$refs.district);
    //   this.$refs.district.value = "";
    //   this.district = "";
    //   console.log("run clear distric", this.district);
    // },
    // handleClearInputWard() {
    //   this.ward = "";
    // },
    handleShowNote() {
      this.is_show_note = !this.is_show_note;
    },
    handleShowOrderInfo() {
      if (!this.validateOrder()) return;
      this.info.address = `${this.address}, ${this.ward}, ${this.district}, ${this.city}`;
      this.is_show_order_info = true;
    },
    handleCloseOrderInfo() {
      this.is_show_order_info = false;
    },
    validateOrder() {
      if (!this.info.name) {
        return this.swalToast("Bạn chưa nhập Họ Tên", "warning");
      }
      if (!this.info.phone) {
        return this.swalToast("Bạn chưa nhập Số ĐT", "warning");
      }
      if (!this.address || !this.city || !this.district || !this.ward) {
        return this.swalToast("Bạn chưa nhập đầy đủ Địa Chỉ", "warning");
      }
      if (!this.info.product) {
        return this.swalToast("Bạn chưa nhập Sản phẩm", "warning");
      }
      if (!this.info.total_price) {
        return this.swalToast("Bạn chưa nhập Tổng giá đơn", "warning");
      }
      return true;
    },
    //handle input (giá trị đơn hàng) show number money
    async checkKeyBoard(event, string) {
      if (
        event.keyCode == 37 ||
        event.keyCode == 39 ||
        event.keyCode == 8 ||
        event.keyCode == 46
      )
        return;
      let caret_pos = event.target.selectionStart;
      let input = document.getElementById("input");
      let number_length = await this.formatNumber(string);
      //handle caret_pos when number length = 3*x+1
      if (number_length == Math.floor(number_length / 3) * 3 + 1) {
        caret_pos = caret_pos + 1;
      }
      //focus in position
      if (input != null) {
        if (input.createTextRange) {
          let range = input.createTextRange();
          range.move("character", caret_pos);
          range.select();
        } else {
          if (input.selectionStart) {
            input.focus();
            input.setSelectionRange(caret_pos, caret_pos);
          } else input.focus();
        }
      }

      if (event.keyCode == 8) {
      }
    },
    async formatNumber(string) {
      let number = string.replace(/\D/g, "");
      this.info.total_price_num = number;
      this.info.total_price = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "VND",
      }).format(number);
      console.log("number", number);
      return number.length;
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

  filters: {
    toCurrency(value) {
      // console.log('type num',typeof value);
      let formatter = new Intl.NumberFormat("de-DE", {
        style: "currency",
        minimumFractionDigits: 0,
        currency: "VND",
      });
      return formatter.format(value);
    },
  },
};
</script>

<style lang="scss" scoped>
$fontSize: 13px;
* {
  font-size: $fontSize;
  line-height: 16px;
  box-sizing: border-box;
  // ::-webkit-scrollbar {
  //   width: 0px;
  //   background-color: rgb(225, 225, 225);
  // }
}
textarea {
  margin-top: 10px;
}
input,
select {
  margin-bottom: 10px;
}
button {
  width: 4rem;
  padding-left: 0;
  padding-right: 0;
}
.option {
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
}
datalist {
  display: none;
}
</style>