"use strict";

class WebOTP {
  constructor(elementOrSelector, onComplete = null, updateToInput = null) {
    // Set default options
    this.emptyChar = " ";
    this.onComplete = onComplete; // Store the onComplete callback

    if (typeof elementOrSelector === "string") {
      this.container = document.querySelector(elementOrSelector);
    } else if (elementOrSelector instanceof Element) {
      this.container = elementOrSelector;
    } else {
      return;
    }

    if (updateToInput) {
      if (typeof updateToInput === "string") {
        this.updateTo = document.querySelector(updateToInput) || null;
      } else if (updateToInput instanceof Element) {
        this.updateTo = updateToInput;
      } else {
        this.updateTo = null;
      }
    }

    this.inputs = Array.from(
      this.container.querySelectorAll(
        "input[type=text], input[type=number], input[type=password]"
      )
    );

    if (this.inputs.length > 0) {
      this._observeContainer(); // Add viewport observer
    }

    this._initializeInputs();
  }

  _initializeInputs() {
    let instance = this;
    let inputCount = instance.inputs.length;

    for (let i = 0; i < inputCount; i++) {
      let input = instance.inputs[i];

      // Focus first empty input when clicking anywhere in the container
      input.addEventListener("click", function () {
        instance._focusFirstEmptyInput();
      });

      input.addEventListener("input", function () {
        // If not a number, restore value
        if (isNaN(input.value)) {
          input.value = input.dataset.otpInputRestore || "";
          return instance._updateValue();
        }

        // If a character is removed, do nothing and save
        if (input.value.length === 0) {
          instance._updateDataFilled(input, false);
          return instance._saveInputValue(i);
        }

        // If single character, save the value and go to next input (if any)
        if (input.value.length === 1) {
          instance._updateDataFilled(input, true);
          instance._saveInputValue(i);
          instance._updateValue();

          // Trigger onComplete if all inputs are filled
          if (instance._areAllInputsFilled() && instance.onComplete) {
            instance.onComplete(instance.getValue());
          }

          if (i + 1 < inputCount) instance.inputs[i + 1].focus();
          return;
        }

        // More characters entered (e.g., pasted), distribute them
        let chars = input.value.split("");
        for (let pos = 0; pos < chars.length; pos++) {
          // Stop if exceeding input count
          if (pos + i >= inputCount) break;

          instance._setInputValue(pos + i, chars[pos]);
        }

        // Focus the next input after the last pasted character
        let focusIndex = Math.min(inputCount - 1, i + chars.length);
        instance.inputs[focusIndex].focus();
      });

      input.addEventListener("keydown", function (e) {
        // Handle backspace, delete, and arrow keys
        instance._handleKeyNavigation(e, i);
      });
    }
  }

  _updateDataFilled(input, isFilled) {
    if (isFilled) {
      input.setAttribute("data-filled", "true");
    } else {
      input.removeAttribute("data-filled");
    }
  }

  _observeContainer() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Focus the first empty input when container enters viewport
            this._focusFirstEmptyInput();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.container);
  }

  _focusFirstEmptyInput() {
    let firstEmptyIndex = this.inputs.findIndex((input) => input.value === "");
    if (firstEmptyIndex === -1) {
      // If all inputs are filled, focus the last input
      firstEmptyIndex = this.inputs.length - 1;
    }
    this.inputs[firstEmptyIndex].focus();
  }

  _handleKeyNavigation(e, i) {
    let inputCount = this.inputs.length;
    let input = this.inputs[i];

    // Backspace
    if (e.keyCode === 8 && input.value === "" && i !== 0) {
      this._setInputValue(i - 1, "");
      this.inputs[i - 1].focus();
      return;
    }

    // Delete
    if (e.keyCode === 46 && i !== inputCount - 1) {
      let selectionStart = input.selectionStart || 0;

      for (let pos = i + selectionStart; pos < inputCount - 1; pos++) {
        this._setInputValue(pos, this.inputs[pos + 1].value);
      }

      this._setInputValue(inputCount - 1, "");
      e.preventDefault();
      return;
    }

    // Left arrow
    if (
      e.keyCode === 37 &&
      (input.selectionStart == null || input.selectionStart === 0)
    ) {
      if (i > 0) {
        e.preventDefault();
        this.inputs[i - 1].focus();
        this.inputs[i - 1].select();
      }
      return;
    }

    // Right arrow
    if (
      e.keyCode === 39 &&
      (input.selectionStart == null ||
        input.selectionEnd === input.value.length)
    ) {
      if (i + 1 < inputCount) {
        e.preventDefault();
        this.inputs[i + 1].focus();
        this.inputs[i + 1].select();
      }
      return;
    }
  }

  _areAllInputsFilled() {
    return this.inputs.every((input) => input.value.length === 1);
  }

  setEmptyChar(char) {
    this.emptyChar = char;
  }

  getValue() {
    let value = "";
    this.inputs.forEach((input) => {
      value += input.value === "" ? this.emptyChar : input.value;
    });
    return value;
  }

  setValue(value) {
    if (isNaN(value)) {
      console.error("Please enter an integer value.");
      return;
    }

    value = "" + value;
    let chars = value.split("");
    for (let i = 0; i < this.inputs.length; i++) {
      this._setInputValue(i, chars[i] || "");
    }
  }

  _setInputValue(index, value) {
    if (isNaN(value)) {
      return console.error("Please enter an integer value.");
    }

    if (!this.inputs[index]) {
      return console.error("Index not found.");
    }

    this.inputs[index].value = String(value).substring(0, 1);
    this._updateDataFilled(this.inputs[index], this.inputs[index].value !== "");
    this._saveInputValue(index);
    this._updateValue();
  }

  _saveInputValue(index, value) {
    if (!this.inputs[index]) {
      return console.error("Index not found.");
    }

    this.inputs[index].dataset.otpInputRestore =
      value || this.inputs[index].value;
  }

  _updateValue() {
    if (this.updateTo) this.updateTo.value = this.getValue();
  }
}
