class CreatePredictions < ActiveRecord::Migration
  def change
    create_table :predictions do |t|
      t.datetime :date
      t.string :homeTeam
      t.string :awayTeam
      t.text :comment
      t.integer :predictionGoalsHomeTeam
      t.integer :predictionGoalsAwayTeam
      t.integer :type_of_bet_id
      t.integer :user_id
      t.integer :result_id

      t.timestamps
    end
  end
end
