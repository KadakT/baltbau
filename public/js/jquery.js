jQuery(document).ready(function () {
  let windowWidth = $(window).width();

  $(".skip-link").on("click", function (e) {
    const targetId = this.getAttribute("href");
    const targetEl = $(targetId);

    if (targetEl.length) {
      targetEl.focus();
      e.preventDefault();
    }
  });

  $(".skip-link").on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      $(this).trigger("click");
      e.preventDefault();
    }
  });

  let logo = $("#logo");
  setInterval(function () {
    logo.attr('src', './img/static_logo.png');
  }, 2500);

  const modal = $("#contactModal");
  const openBtn = $("#openModalBtn");
  const closeBtn = $(".form__close-btn");
  const $name = $("#name");
  const $nameError = $("#nameError");
  const $email = $("#email");
  const $emailError = $("#emailError");
  const $message = $("#message");
  const $messageError = $("#messageError");
  const maxChars = 1000;
  let modalDom = $(".modal__conatiner").get(0);
  let focusedElementBeforeModal;

  function resetForm() {
    $("#contactForm")[0].reset();
    $(".error-message").text("");
    $(".field-error").removeClass("field-error");
    $("#messageCounter").text(`Noch 1000 Zeichen verfügbar`);
    modal.fadeOut();
    if (focusedElementBeforeModal) focusedElementBeforeModal.focus();
  };

  openBtn.on("click", function () {
    focusedElementBeforeModal = this;
    modal.fadeIn();
  });

  closeBtn.on("click", function () {
    resetForm();
  });

  closeBtn.on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      $(this).click();
      e.preventDefault();
    }
  });


  // Hide url parameters in address bar 
  //history.replaceState(null, document.querySelector("title").innerText, window.location.pathname);
  /*
    Function for scrolling to anchor
    ************************************/
  $(function () {
    $('a[href*="#"]:not([href="#"])').on("click", function () {
      // I need  to close nav but it breaks scroll to corect place, need to invistigate

      $(this).parent().addClass('selected').siblings().removeClass('selected');

      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          console.log(target.offset().top);
          $('html, body').animate({
            // scrollTop: target.offset().top
            scrollTop: target.offset().top - 100
          }, 1000, function () {
            if (windowWidth < 900) {
              $(".navigation__btn").removeClass("close");
              $(".navigation__nav").slideUp("slow");
            }
          });
          return false;
        }
      }
    });
  });


  // mobile menu click function

  $(window).on("resize scroll", function () {
    windowWidth = $(window).width();
    if (windowWidth >= 992) {
      $(".navigation__nav").removeAttr('style');
      $(".navigation__btn").removeClass("close");
    }
  });

  $(document).on("click", function (e) {
    const isOutsideNav = !$(e.target).closest(".navigation__nav, .navigation__btn").length;
    if (windowWidth <= 992) {
      if (isOutsideNav) {
        $(".navigation__btn").removeClass("close");
        $(".navigation__nav").slideUp("slow");
      } else {
        $(".navigation__btn").toggleClass("close");
        $(".navigation__nav").slideToggle("slow");
      }
    }

    if (e.target === modalDom) {
      resetForm();
    }
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $("#contactModal").is(":visible")) {
      resetForm();
      if (focusedElementBeforeModal) focusedElementBeforeModal.focus();
    }


    if (!modal) return;
    const focusableEls = modalDom.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select, textarea, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  $("#contactForm").on("submit", function (e) {
    e.preventDefault();
    let valid = true;
    $nameError.text("");
    $emailError.text("");
    $messageError.text("");
    $message.removeClass("field-error");

    const nameValue = $name.val().trim();
    const emailValue = $email.val().trim();
    const messageValue = $message.val().trim();

    if (!nameValue) {
      $nameError.text("Bitte geben Sie Ihren Namen ein.");
      $name.addClass("field-error");
      valid = false;
    }
    if (!emailValue) {
      $emailError.text("Bitte geben Sie Ihre E-Mail-Adresse ein.");
      $email.addClass("field-error");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      $emailError.text("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      $email.addClass("field-error");
      valid = false;
    }

    if (!messageValue) {
      $messageError.text("Bitte schreiben Sie eine Nachricht.");
      $message.addClass("field-error");
      valid = false;
    } else if (messageValue.length < 10) {
      $messageError.text("Die Nachricht muss mindestens 10 Zeichen lang sein.");
      $message.addClass("field-error");
      valid = false;
    } else if (messageValue.length > 1000) {
      $messageError.text("Die Nachricht darf maximal 1000 Zeichen enthalten.");
      $message.addClass("field-error");
      valid = false;
    }

    if (valid) {
      $.post("php/send.php", $(this).serialize(), function (response) {
        if (response === "OK") {
          $("#formResponse").text("Nachricht erfolgreich gesendet!").addClass("submitted-form");
          $("#contactForm")[0].reset();
        } else {
          $("#formResponse").text(response).addClass("invalid-form");
        }
      });
    }
  });

  $("#name").on("input", function () {
    $(this).removeClass("field-error");
    $("#nameError").text("");
  });

  $("#email").on("input", function () {
    $(this).removeClass("field-error");
    $("#emailError").text("");
  });

  $("#message").on("input", function () {
    const currentLength = $(this).val().length;
    const remaining = maxChars - currentLength;

    $("#messageCounter").text(`Noch ${remaining} Zeichen verfügbar`);

    $(this).removeClass("field-error");
    $("#messageError").text("");
  });

});

