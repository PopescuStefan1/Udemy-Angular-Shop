import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(
          this.editedItemIndex
        );
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  addItem(ingredient: Ingredient) {
    let found = this.shoppingListService.updateIngredientAmount(ingredient);

    if (!found) {
      this.shoppingListService.addIngredientToList(ingredient);
    }
  }

  editItem(ingredient: Ingredient) {
    this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.editItem(newIngredient);
    } else {
      this.addItem(newIngredient);
    }

    this.clearForm(form);
  }

  clearForm(form: NgForm) {
    this.editMode = false;
    form.reset();
  }

  deleteIngredient(form: NgForm) {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.clearForm(form);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
