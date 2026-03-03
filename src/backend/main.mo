import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

actor {
  type ContactForm = {
    name : Text;
    email : Text;
    company : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module ContactForm {
    public func compare(a : ContactForm, b : ContactForm) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let inquiryStore = Map.empty<Text, ContactForm>();

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, company : Text, message : Text) : async () {
    let timestamp = Time.now();
    let contact : ContactForm = {
      name;
      email;
      company;
      message;
      timestamp;
    };

    inquiryStore.add(email # timestamp.toText(), contact);
  };

  public query ({ caller }) func getAllContactForms() : async [ContactForm] {
    let entries = inquiryStore.toArray();
    if (entries.size() == 0) { Runtime.trap("No contact forms found!") };

    let contactForms = entries.map(func((_, form)) { form });
    contactForms.sort();
  };
};
