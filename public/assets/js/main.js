// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(document).ready(function () {

  /**
   * /user-info for Customers Update Form
   */
  $(".updateCustomerForm").on("submit", function (event) {
    event.preventDefault();
    // build the userData object
    const userData = {
      firstName: $("#firstName").val().trim(),
      lastName: $("#lastName").val().trim(),
      streetAddress: $("#streetAddress").val().trim(),
      city: $("#city").val().trim(),
      state: $("#state").val().trim(),
      zipCode: $("#zipCode").val().trim(),
      phoneNumber: $("#phoneNumber").val().trim(),
      email: $("#email").val().trim()
    };

    const url = "/api/customers/" + $("#id").val().trim();

    //Send the POST request.
    $.ajax({
      url: url,
      type: "PUT",
      data: userData
    }).then(function (data) {
      // Reload the page to get the updated list
      alert("Successfully updated the user information");
      location.href = "/user-info";
    });
  });
  // init New Service Form as hidden
  $("#addServiceForm").hide();
  let addingService = false;

  /**
   * Toggle show/hide the New Service Form
   */
  $("#addServiceBtn").on("click", function (event) {
    event.preventDefault();

    addingService = !addingService;

    if (addingService) {
      $("#addServiceForm").show();
    } else {
      $("#addServiceForm").hide();
    }
  });

  /**
   * make_base_auth
   * @description Takes username password
   * returns "Basic " + base64 encoded "username:password"
   * @param {string} u - username
   * @param {string} p - password
   */
  function make_base_auth(u, p) {
    return "Basic " + btoa(u + ":" + p);
  }

  /**
   * On Register Submit, Register new user/customer
   */
  $("#reg-submit-btn").on("click", function (event) {
    event.preventDefault();
    // grab username password for authorization header
    let uname = $("#username")
      .val()
      .trim();
    let pwrd = $("#password")
      .val()
      .trim();
    // build the userData object
    const userData = {
      firstName: $("#firstName").val().trim(),
      lastName: $("#lastName").val().trim(),
      address: $("#address").val().trim(),
      city: $("#city").val().trim(),
      state: $("#state").val().trim(),
      zipCode: $("#zipCode").val().trim(),
      phoneNumber: $("#phoneNumber").val().trim(),
      email: $("#email").val().trim()
    };

    //Send the POST request.
    $.ajax({
      url: "/register",
      type: "POST",
      data: userData,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", make_base_auth(uname, pwrd));
      }
    }).then(function (data) {
      // store user in local storage
      localStorage.setItem("user", JSON.stringify(data));

      // Reload the page to get the updated list
      location.href = "/service-menu";
    });
  });

  /**
   * On Handyman Register Submit, Register new handyman
   */
  $("#handyreg-submit-btn").on("click", function (event) {
    event.preventDefault();
    try {

      // get username and password for the Authorization header
      let uname = $("#username").val().trim();
      let pwrd = $("#password").val().trim();
      // build the userData object
      const userData = {
        firstName: $("#firstName").val().trim(),
        lastName: $("#lastName").val().trim(),
        address: $("#address").val().trim(),
        city: $("#city").val().trim(),
        state: $("#state").val().trim(),
        zipCode: $("#zipCode").val().trim(),
        phoneNumber: $("#phoneNumber").val().trim(),
        email: $("#email").val().trim(),
      };

      //Send the POST request.
      $.ajax({
        url: "/handyman-register",
        type: "POST",
        data: userData,
        beforeSend: function (xhr) {
          // create a Basic authorization header
          xhr.setRequestHeader('Authorization', make_base_auth(uname, pwrd));
        },
        success: function (data) {
          // Reload the page to get the updated list
          location.href = "/update-service";
        },
        error: function (err) {
          // Reload the page to get the updated list
          alert(err);
        }
      });
    } catch (err) {
      alert(err);
    }
  });

  /**
   * User has chosen a date and a service,
   * move on to Create Service Request,
   * we'll need to request all of the available
   * handymen and sort them based on ?
   * TODO: confirm how this works.
   */
  $("#calendarSubmit").on("click", function (event) {
    event.preventDefault();
    const jobDate = { date: $("#serviceCalendar").val(), serviceId: $("#servicesDropdown").val() };
    $.ajax({
      url: "/api/handymans", //get availability from db
      type: "GET",
      data: jobDate        //send this input to table.
    }).then(function (jobData) {
      let reqArray = [
        { startTime: "0900", endTime: "1100" },
        { startTime: "1000", endTime: "1200" },
        { startTime: "1300", endTime: "1500" },
        { startTime: "1400", endTime: "1600" },
        { startTime: "1500", endTime: "1700" }
      ]
      var select = $("<select>").attr("style", "display:block").attr("id", "timeSelect").appendTo($("#availability"));
      for (i = 0; i < reqArray.length; i++) {
        select.append($("<option>").attr("value", i).text(reqArray[i].startTime + " until " + reqArray[i].endTime));
      }
      $("<input>").attr("type", "submit").attr("id", "bookIt").attr("value", "Book It!").appendTo($("#availability"))
    })

  });

  $(document).on("click", "#bookIt", function (event) {
    event.preventDefault();

    var booking = {
      status: "scheduled",
      ServiceMenuId: $("#servicesDropdown").val(),
      startDate: $("#serviceCalendar").val(),
      sHour: $("#timeSelect").val()//time only shows slot id, not values associated.
    }

    $.ajax({
      url: "/api/request",
      type: "POST",
      data: booking
    }).then(bookedService => {
      alert(JSON.stringify(bookedService, null, 2));
    });
  });

  $("#timeSlotForm").on("click", "tbody", "tr", function (event) {
    $(this)
      .addClass("highlight")
      .siblings()
      .removeClass("highlight");
  });

  $("#timeSubmit").on("click", function (event) {
    var rows = isLitRow();
    var timeSlot = rows.attr("id");
    $.ajax({
      url: "/api/request/confirm",
      type: "POST",
      data: timeSlot
    }).then(function (data) {
      console.log("data time slot sent");
    });
  });

  var isLitRow = function () {
    return $("table > tbody > tr.highlight");
  };

  /**
   * User has entered user name and password
   * into /login screen
   * on submit data will be posted to /login
   *  */

  $("#loginForm").on("submit", function (event) {
    event.preventDefault();

    const uname = $("#loginForm [name=username]").val().trim();
    const pwrd = $("#loginForm [name=password]").val().trim();

    $.ajax("/login", {
      method: "POST",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", make_base_auth(uname, pwrd));
      },
      success: function (data) {
        localStorage.setItem("access_token", JSON.stringify(data.access_token));
        location.href = "/service-menu";
      },
      error: function (err) {
        alert(err.responseJSON);
        $("#loginForm")[0].reset();
      }
    });
  });

  $("#handyloginForm").on("submit", function (event) {
    event.preventDefault();

    const uname = $("#handyloginForm [name=username]").val().trim();
    const pwrd = $("#handyloginForm [name=password]").val().trim();

    $.ajax("/handyman-login", {
      method: "POST",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", make_base_auth(uname, pwrd));
      },
      success: function (data) {
        location.href = "/update-service";
      },
      error: function (err) {
        alert(err.responseJSON);
        $("#handyloginForm")[0].reset();
      }
    });
  });

  $("#updateStatus").on("click", function (event) {
    event.preventDefault();
    const newStatus = $("#updateServiceRequest").val();
    $.ajax({
      url: "/api/update/service",
      type: "PUT",
      data: newStatus
    }).then(function (data) {
      console.log("status changed");
    });
  });

  //for the service selection page Materialize will not show dropdowns by default
  $("select").formSelect();
});
