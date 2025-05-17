---
title: "Rails Version Management with Rails AppVersion"
slug: "rails-version-management-best-practices-with-rails-appversion-1h6b"
pubDate: 2025-01-02T21:14:58.242Z
description: "Rails AppVersion provides a standard way to handle version and environment information in Rails..."

tags: ["rails", "tutorial"]
---

Rails AppVersion provides a standard way to handle version and environment information in Rails applications. It eliminates the need for custom version management solutions while providing useful conventions for error tracking, caching, and deployment verification.

Key Features
- Version information through `Rails.application.version`
- Environment management via `Rails.application.env`
- Version-aware response headers
- Cache key generation
- Console environment information

Basic Setup

```ruby
# Gemfile
gem "rails_app_version"

# Terminal
bundle install
rails app:version:config
echo "1.0.0" > VERSION
```

Common Use Cases

Error Tracking:
```ruby
Sentry.init do |config|
  config.release = Rails.application.version.to_s
  config.environment = Rails.application.env
end
```

Cache Management:
```ruby
def index
  Rails.cache.fetch("index-page-#{Rails.application.version.to_cache_key}") do
    render :index
  end
end
```

Version Headers:
```yaml
# config/app_version.yml
staging:
  middleware:
    enabled: true
    options:
      version_header: X-Staging-Version
      environment_header: X-Staging-Environment
```

Testing:
```ruby
class VersionTest < ActiveSupport::TestCase
  test "version information" do
    assert_equal "1.2.3", Rails.application.version.to_s
    assert_equal "1-2-3", Rails.application.version.to_cache_key
  end
end
```

Version Management Options

1. VERSION File (Recommended):
```plaintext
1.2.3
```

2. YAML Configuration:
```yaml
shared:
  version: <%= Rails.root.join('VERSION').read.strip rescue '0.0.0' %>
  revision: <%= Rails.root.join('REVISION').read.strip rescue (`git rev-parse HEAD`.strip rescue '0') %>
```

Accessing Version Details:
```ruby
Rails.application.version.major      # => 1
Rails.application.version.minor      # => 2
Rails.application.version.patch      # => 3
Rails.application.version.full       # => "1.2.3 (abc123de)"
```

Environment Management:
```ruby
Rails.application.env               # => "staging"
Rails.application.env.production?   # => false
Rails.application.env.staging?      # => true
```

The gem is available at https://github.com/seuros/rails_app_version under the MIT License.