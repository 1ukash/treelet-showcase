# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_treeapp_session',
  :secret      => 'dd3a4e7a83b672cc9cf3c1c385b9a18c9ce4c22046e6985630ac383e8072d2109cd918ef12612df16c6ce82978b3a20353ed554360a8243dafaa1f0d76b222cd'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
