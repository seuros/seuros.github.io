---
title: "NoFlyList: Choosing Between Polymorphic and Model-Specific Tags"
slug: "noflylist-choosing-between-polymorphic-and-model-specific-tags-4phh"
pubDate: 2024-12-20T14:39:04.950Z
description: "Let's build a blog platform to understand when to use polymorphic vs model-specific tags.          ..."

tags: ["rails", "tutorial"]
---

Let's build a blog platform to understand when to use polymorphic vs model-specific tags.

## Setup

```ruby
# Create our models
rails generate model Article title:string content:text
rails generate model Video title:string url:string
rails generate no_fly_list:install      # For polymorphic tags
rails generate no_fly_list:tagging Article
rails generate no_fly_list:tagging Video
```

## Scenario 1: Shared Categories

Articles and videos share the same category system:

```ruby
class Article < ApplicationRecord
  include NoFlyList::TaggableRecord
  
  has_tags :categories,
    polymorphic: true,  # Uses shared tags table
    restrict_to_existing: true
end

class Video < ApplicationRecord
  include NoFlyList::TaggableRecord
  
  has_tags :categories,
    polymorphic: true,
    restrict_to_existing: true
end

# Usage
article = Article.create!(title: "Rails Tips")
article.categories_list = "programming, tutorials"

video = Video.create!(title: "Rails Setup Guide")
video.categories_list = "programming, beginners"

# Find all programming content across both models
articles = Article.with_any_categories("programming")
videos = Video.with_any_categories("programming")
```

## Scenario 2: Model-Specific Tags

Articles have technical requirements, videos have equipment details:

```ruby
class Article < ApplicationRecord
  include NoFlyList::TaggableRecord
  
  has_tags :technical_requirements  # Model-specific
end

class Video < ApplicationRecord
  include NoFlyList::TaggableRecord
  
  has_tags :equipment_used  # Model-specific
end

# Usage
article.technical_requirements_list = "ruby-3.2, rails-7.2"
video.equipment_used_list = "sony-a7iii, rode-mic"
```

## Mixed Usage

Combine both approaches:

```ruby
class Article < ApplicationRecord
  include NoFlyList::TaggableRecord
  
  has_tags :categories, polymorphic: true  # Shared
  has_tags :technical_requirements         # Specific
  has_tags :author_notes                   # Specific
end

# Find articles by shared categories and specific requirements
Article.with_any_categories("programming")
       .with_all_technical_requirements("ruby-3.2")
```

## Database Structure

Polymorphic tags:
```ruby
# application_tags
create_table :application_tags do |t|
  t.string :name
  t.timestamps
end

# application_taggings
create_table :application_taggings do |t|
  t.references :tag
  t.references :taggable, polymorphic: true
  t.string :context
  t.timestamps
end
```

Model-specific tags:
```ruby
# article_tags
create_table :article_tags do |t|
  t.string :name
  t.timestamps
end

# article_taggings
create_table :article_taggings do |t|
  t.references :tag
  t.references :article
  t.string :context
  t.timestamps
end
```

## When to Use Each

Use polymorphic tags when:
- Tags need to be shared across models
- You want centralized tag management
- Tags require validation across all models

Use model-specific tags when:
- Tags are unique to the model
- You want simpler queries
- Tags don't need to be shared

## Performance Considerations

Polymorphic tags:
- One query across multiple tables
- Slower for large datasets
- More complex indexes

Model-specific tags:
- Direct table access
- Faster for single-model queries
- Simpler indexing

[Part3](/blog/noflylist-custom-tag-screening-with-noflylist-553j)