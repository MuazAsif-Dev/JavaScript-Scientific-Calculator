# JavaScript Scientific Calculator

### Modules:

**1. Expressions**:

- The calculator is able to parse full expressions using mathematical rules.
- The calculator supports following operations with the mentioned symbols:
  - Addition: +
  - Subtraction: -
  - Multiplication: \*
  - Division: /
  - Exponentiation: ^
  - Precedence/Parentheses: ( expression... )
  - Square root: sqrt( expression… )
  - Sine: sin( expression… )
  - Cosine: cos( expression… )
  - Tangent: tan( expression… )

**2. Text/Expression Input**

- The calculator has an editable text input.
- The user can freely type in the desired expression through their keyboard.
- The expression updates accordingly when the corresponding calculator button is clicked by the user.

**3. Output Display**

- The calculator has a display where the entered expression's result is shown.
- The output is fixed to 4 decimal points.

**4. Buttons**

- The calculator has buttons for entering each element of the expression in the text input.

**5. Exception Handling**

- The application handles all exceptions like dividing by zero or incomplete/wrong expression etc.
- A helpful error message is shown on the output display.

**6. Variables and Constants**

- The calculator supports adding the following constants in expressions:
  - Pi: pi (3.1415)
  - Euler’s Number: e (2.7182)
- The calculator supports adding variables in the expressions.
- When the user types these variables and constants in expressions, they are evaluated to their stored values.

**7. History**

- The app maintains the history of all evaluated expressions with their results (a history item).
- The view allows the user to fill text input when a history item is clicked.
- The user can delete an item from history.
