class CreateElements < ActiveRecord::Migration
  def self.up
    create_table :elements do |t|
      t.integer :id
      t.integer :parent
      t.text :name

      t.timestamps
    end
  end

  def self.down
    drop_table :elements
  end
end
